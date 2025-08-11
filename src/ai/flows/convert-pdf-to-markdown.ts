// src/ai/flows/convert-pdf-to-markdown.ts
'use server';
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
    const pdfBuffer = Buffer.from(input.pdfContent, 'base64');
    const data = await pdf(pdfBuffer);
    return {
      markdownContent: data.text,
    };
  }
);
