'use server';

import { enhanceMarkdownNarrative } from '@/ai/flows/enhance-markdown-narrative';
import { convertTextToSpeech } from '@/ai/flows/convert-text-to-speech';
import { convertPdfToMarkdown } from '@/ai/flows/convert-pdf-to-markdown';

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

export async function handlePdfToMarkdown(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const pdfContent = buffer.toString('base64');
  
  try {
    const result = await convertPdfToMarkdown({ pdfContent });
    return { success: true, data: result.markdownContent };
  } catch (error) {
    console.error('Error converting PDF to markdown:', error);
    return { success: false, error: 'Failed to convert PDF to markdown.' };
  }
}
