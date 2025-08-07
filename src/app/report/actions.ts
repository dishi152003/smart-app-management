'use server';

import {
  suggestIssueCategories,
  type SuggestIssueCategoriesOutput,
} from '@/ai/flows/suggest-issue-categories';
import { db } from '@/lib/firestore';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { z } from 'zod';

const suggestionSchema = z.object({
  description: z.string().min(10, 'Please provide a more detailed description.'),
  photo: z.string().optional(),
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
  const validatedFields = suggestionSchema.safeParse({
    description: formData.get('description'),
    photo: formData.get('photo'),
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
      photoDataUri: validatedFields.data.photo,
    });
    return { success: true, data: result };
  } catch (e) {
    return { success: false, error: 'AI suggestion failed. Please try again.' };
  }
}

const reportSchema = z.object({
    description: z.string(),
    categories: z.array(z.string()).min(1, 'Please select at least one category.'),
    location: z.object({
        lat: z.number(),
        lng: z.number(),
    }).optional(),
    photo: z.string().optional(),
});

export type ReportState = {
    success: boolean;
    message: string;
}

export async function submitIssueReport(
    prevState: ReportState,
    formData: FormData
): Promise<ReportState> {

    const categories = formData.getAll('categories[]');
    const lat = formData.get('lat');
    const lng = formData.get('lng');

    const submissionData = {
        description: formData.get('description'),
        categories,
        photo: formData.get('photo'),
        location: lat && lng ? { lat: parseFloat(lat.toString()), lng: parseFloat(lng.toString()) } : undefined,
    }

    try {
        await addDoc(collection(db, "issues"), {
            ...submissionData,
            status: 'new',
            submittedAt: serverTimestamp(),
        });
        return { success: true, message: "Thank you for your submission. Your report has been successfully saved." };
    } catch (error) {
        console.error("Error adding document: ", error);
        return { success: false, message: "There was an error saving your report. Please try again." };
    }
}
