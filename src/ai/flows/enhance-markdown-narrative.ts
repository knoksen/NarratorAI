// src/ai/flows/enhance-markdown-narrative.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for enhancing markdown content to improve its narrative quality for audio.
 *
 * - enhanceMarkdownNarrative - A function that enhances markdown content.
 * - EnhanceMarkdownNarrativeInput - The input type for the enhanceMarkdownNarrative function.
 * - EnhanceMarkdownNarrativeOutput - The return type for the enhanceMarkdownNarrative function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceMarkdownNarrativeInputSchema = z.object({
  markdownContent: z
    .string()
    .describe('The markdown content to be enhanced for audio narration.'),
});
export type EnhanceMarkdownNarrativeInput = z.infer<
  typeof EnhanceMarkdownNarrativeInputSchema
>;

const EnhanceMarkdownNarrativeOutputSchema = z.object({
  enhancedContent: z
    .string()
    .describe('The enhanced markdown content suitable for audio narration.'),
});
export type EnhanceMarkdownNarrativeOutput = z.infer<
  typeof EnhanceMarkdownNarrativeOutputSchema
>;

export async function enhanceMarkdownNarrative(
  input: EnhanceMarkdownNarrativeInput
): Promise<EnhanceMarkdownNarrativeOutput> {
  return enhanceMarkdownNarrativeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceMarkdownNarrativePrompt',
  input: {schema: EnhanceMarkdownNarrativeInputSchema},
  output: {schema: EnhanceMarkdownNarrativeOutputSchema},
  prompt: `You are an AI expert in enhancing markdown content for audio narration.

  Your goal is to process the given markdown content and improve its narrative quality for an engaging audio experience. This includes:

  - Adding emotion to the text where appropriate.
  - Reformatting the content for dialogue if applicable, ensuring clear speaker turns.
  - Fixing any formatting issues that might hinder the audio rendition.
  - Adding narrative details to enhance the overall suitability for audio, such as scene descriptions or character reactions.

  Here is the markdown content you will be working with:
  {{{markdownContent}}}

  Please return the enhanced markdown content.`,
});

const enhanceMarkdownNarrativeFlow = ai.defineFlow(
  {
    name: 'enhanceMarkdownNarrativeFlow',
    inputSchema: EnhanceMarkdownNarrativeInputSchema,
    outputSchema: EnhanceMarkdownNarrativeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
