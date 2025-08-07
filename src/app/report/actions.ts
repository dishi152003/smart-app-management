'use server';

import {
  suggestIssueCategories,
  type SuggestIssueCategoriesOutput,
} from '@/ai/flows/suggest-issue-categories';
import { z } from 'zod';

const schema = z.object({
  description: z.string().min(10, 'Please provide a more detailed description.'),
});

export type SuggestionState = {
  success: boolean;
  data?: SuggestIssueCategoriesOutput;
  error?: string;
  fieldErrors?: {
    description?: string[];
  };
};

export async function getCategorySuggestions(
  prevState: SuggestionState,
  formData: FormData
): Promise<SuggestionState> {
  const validatedFields = schema.safeParse({
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid input.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await suggestIssueCategories({
      description: validatedFields.data.description,
    });
    return { success: true, data: result };
  } catch (e) {
    return { success: false, error: 'AI suggestion failed. Please try again.' };
  }
}
