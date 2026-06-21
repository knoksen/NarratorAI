'use server';

import { enhanceMarkdownNarrative } from '@/ai/flows/enhance-markdown-narrative';
import { convertTextToSpeech } from '@/ai/flows/convert-text-to-speech';
import { convertPdfToMarkdown } from '@/ai/flows/convert-pdf-to-markdown';

const MISSING_API_KEY_MESSAGE =
  'Missing AI API key. Set GEMINI_API_KEY or GOOGLE_API_KEY, then restart the app.';

function hasAiApiKey() {
  return Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
}

function toUserError(error: unknown, fallback: string) {
  if (error instanceof Error) {
    const msg = error.message;

    if (msg.includes('GEMINI_API_KEY') || msg.includes('GOOGLE_API_KEY')) {
      return MISSING_API_KEY_MESSAGE;
    }

    if (msg.includes('429') || msg.toLowerCase().includes('quota exceeded')) {
      return 'Gemini API quota exceeded. Check plan/billing or wait for quota reset, then retry.';
    }

    return msg;
  }
  return fallback;
}

export async function handleEnhanceContent(markdown: string) {
  if (!hasAiApiKey()) {
    return { success: false, error: MISSING_API_KEY_MESSAGE };
  }

  try {
    const result = await enhanceMarkdownNarrative({ markdownContent: markdown });
    if (result.enhancedContent) {
      return { success: true, data: result.enhancedContent };
    }
    throw new Error('Enhanced content is empty.');
  } catch (error) {
    console.error('Error enhancing content:', error);
    return { success: false, error: toUserError(error, 'Failed to enhance content.') };
  }
}

export async function handleGenerateAudio(text: string) {
  if (!hasAiApiKey()) {
    return { success: false, error: MISSING_API_KEY_MESSAGE };
  }

  try {
    const result = await convertTextToSpeech({ text });
    if (result.audioDataUri) {
      return { success: true, data: result.audioDataUri };
    }
    throw new Error('Audio data URI is empty.');
  } catch (error) {
    console.error('Error generating audio:', error);
    return { success: false, error: toUserError(error, 'Failed to generate audio.') };
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
