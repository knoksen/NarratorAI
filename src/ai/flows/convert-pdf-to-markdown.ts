// src/ai/flows/convert-pdf-to-markdown.ts
/**
 * @fileOverview This file defines a Genkit flow for converting a PDF to Markdown.
 *
 * - convertPdfToMarkdown - A function that converts a PDF to markdown.
 * - ConvertPdfToMarkdownInput - The input type for the convertPdfToMarkdown function.
 * - ConvertPdfToMarkdownOutput - The return type for the convertPdfToMarkdown function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import pdf from 'pdf-parse';

const ConvertPdfToMarkdownInputSchema = z.object({
  pdfContent: z
    .string()
    .describe('The base64 encoded PDF content to be converted to markdown.'),
});
export type ConvertPdfToMarkdownInput = z.infer<
  typeof ConvertPdfToMarkdownInputSchema
>;

const ConvertPdfToMarkdownOutputSchema = z.object({
  markdownContent: z
    .string()
    .describe('The converted markdown content.'),
});
export type ConvertPdfToMarkdownOutput = z.infer<
  typeof ConvertPdfToMarkdownOutputSchema
>;

export async function convertPdfToMarkdown(
  input: ConvertPdfToMarkdownInput
): Promise<ConvertPdfToMarkdownOutput> {
  return convertPdfToMarkdownFlow(input);
}

const convertPdfToMarkdownFlow = ai.defineFlow(
  {
    name: 'convertPdfToMarkdownFlow',
    inputSchema: ConvertPdfToMarkdownInputSchema,
    outputSchema: ConvertPdfToMarkdownOutputSchema,
  },
  async input => {
    try {
      const pdfBuffer = Buffer.from(input.pdfContent, 'base64');
      const data = await pdf(pdfBuffer);
      
      if (!data.text || data.text.trim().length === 0) {
        throw new Error('PDF appears to be empty or contains only images. Please try a PDF with text content.');
      }
      
      return {
        markdownContent: data.text,
      };
    } catch (error) {
      console.error('Error converting PDF to markdown:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to convert PDF: ${error.message}`);
      }
      throw new Error('Failed to convert PDF to markdown. Please ensure the file is a valid PDF.');
    }
  }
);
