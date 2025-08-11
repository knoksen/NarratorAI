// ConvertTextToSpeech story implementation.
'use server';
/**
 * @fileOverview Converts enhanced text into high-quality speech using a cloud-based TTS service.
 *
 * - convertTextToSpeech - A function that handles the text-to-speech conversion process.
 * - ConvertTextToSpeechInput - The input type for the convertTextToSpeech function.
 * - ConvertTextToSpeechOutput - The return type for the convertTextToSpeech function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const ConvertTextToSpeechInputSchema = z.object({
  text: z.string().describe('The enhanced text to convert to speech.'),
});
export type ConvertTextToSpeechInput = z.infer<typeof ConvertTextToSpeechInputSchema>;

const ConvertTextToSpeechOutputSchema = z.object({
  audioDataUri: z.string().describe('The audio data URI in WAV format.'),
});
export type ConvertTextToSpeechOutput = z.infer<typeof ConvertTextToSpeechOutputSchema>;

export async function convertTextToSpeech(input: ConvertTextToSpeechInput): Promise<ConvertTextToSpeechOutput> {
  return convertTextToSpeechFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const convertTextToSpeechFlow = ai.defineFlow(
  {
    name: 'convertTextToSpeechFlow',
    inputSchema: ConvertTextToSpeechInputSchema,
    outputSchema: ConvertTextToSpeechOutputSchema,
  },
  async input => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: input.text,
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    return {
      audioDataUri: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
  }
);
