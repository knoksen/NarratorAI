// ConvertTextToSpeech story implementation.
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
    try {
      if (!input.text || input.text.trim().length === 0) {
        throw new Error('No text provided for speech generation.');
      }
      
      // Text length validation (Google TTS has limits)
      if (input.text.length > 5000) {
        throw new Error('Text is too long. Please limit to 5000 characters.');
      }
      
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
      
      if (!media || !media.url) {
        throw new Error('No audio was generated. Please try again.');
      }
      
      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );
      
      const wavData = await toWav(audioBuffer);
      
      return {
        audioDataUri: 'data:audio/wav;base64,' + wavData,
      };
    } catch (error) {
      console.error('Error converting text to speech:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to generate audio: ${error.message}`);
      }
      throw new Error('Failed to generate audio. Please check your API key and try again.');
    }
  }
);
