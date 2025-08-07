'use server';

/**
 * @fileOverview A flow that suggests relevant categories for an issue report
 *
 * - suggestIssueCategories - A function that suggests categories for an issue report.
 * - SuggestIssueCategoriesInput - The input type for the suggestIssueCategories function.
 * - SuggestIssueCategoriesOutput - The return type for the suggestIssueCategories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestIssueCategoriesInputSchema = z.object({
  description: z.string().describe('The description of the issue reported by the user.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of the issue, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SuggestIssueCategoriesInput = z.infer<
  typeof SuggestIssueCategoriesInputSchema
>;

const SuggestIssueCategoriesOutputSchema = z.object({
  categories:
    z
      .array(z.string())
      .describe('An array of suggested categories for the issue.'),
  reasoning:
    z
      .string()
      .describe('The reasoning behind the category suggestions.'),
});
export type SuggestIssueCategoriesOutput = z.infer<
  typeof SuggestIssueCategoriesOutputSchema
>;

export async function suggestIssueCategories(
  input: SuggestIssueCategoriesInput
): Promise<SuggestIssueCategoriesOutput> {
  return suggestIssueCategoriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestIssueCategoriesPrompt',
  input: {schema: SuggestIssueCategoriesInputSchema},
  output: {schema: SuggestIssueCategoriesOutputSchema},
  prompt: `You are an AI assistant helping users categorize their issue reports for a smart city application.

  Based on the user's description, and the photo if provided, suggest relevant categories for their issue report.
  Also provide a brief reasoning for why you are suggesting these categories.

  Description: {{{description}}}
  {{#if photoDataUri}}
  Photo: {{media url=photoDataUri}}
  {{/if}}

  Format your response as a JSON object with "categories" and "reasoning" fields. The "categories" field should be an array of strings.
  `,
});

const suggestIssueCategoriesFlow = ai.defineFlow(
  {
    name: 'suggestIssueCategoriesFlow',
    inputSchema: SuggestIssueCategoriesInputSchema,
    outputSchema: SuggestIssueCategoriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
