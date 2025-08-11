'use server';

import { enhanceMarkdownNarrative } from '@/ai/flows/enhance-markdown-narrative';
import { convertTextToSpeech } from '@/ai/flows/convert-text-to-speech';

export async function handleEnhanceContent(markdown: string) {
  try {
    const result = await enhanceMarkdownNarrative({ markdownContent: markdown });
    if (result.enhancedContent) {
      return { success: true, data: result.enhancedContent };
    }
    throw new Error('Enhanced content is empty.');
  } catch (error) {
    console.error('Error enhancing content:', error);
    return { success: false, error: 'Failed to enhance content.' };
  }
}

export async function handleGenerateAudio(text: string) {
  try {
    const result = await convertTextToSpeech({ text });
    if (result.audioDataUri) {
      return { success: true, data: result.audioDataUri };
    }
    throw new Error('Audio data URI is empty.');
  } catch (error) {
    console.error('Error generating audio:', error);
    return { success: false, error: 'Failed to generate audio.' };
  }
}
