'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { getCategorySuggestions, type SuggestionState } from '@/app/report/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wand2, AlertTriangle, Lightbulb, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

const initialState: SuggestionState = {
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Getting Suggestions...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" /> Suggest Categories with AI
        </>
      )}
    </Button>
  );
}

export function ReportIssueForm() {
  const [state, formAction] = useFormState(getCategorySuggestions, initialState);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { toast } = useToast();
  
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(selectedCategories.length === 0) {
      toast({
        variant: "destructive",
        title: "No Category Selected",
        description: "Please select at least one category before submitting.",
      });
      return;
    }

    toast({
        title: "Issue Reported!",
        description: "Thank you for your submission. Your report has been received.",
    });
  }

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <div>
          <Label htmlFor="description" className="text-base">Issue Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="For example: 'The street lights on Main Street have been flickering for the past week.'"
            rows={5}
            required
            className="mt-2"
          />
          {state.fieldErrors?.description && (
            <p className="text-sm font-medium text-destructive mt-1">{state.fieldErrors.description}</p>
          )}
        </div>
        <SubmitButton />
      </form>

      {state.error && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <div>
              <CardTitle className="text-destructive text-lg">Error</CardTitle>
              <CardDescription className="text-destructive/80">{state.error}</CardDescription>
            </div>
          </CardHeader>
        </Card>
      )}

      {state.success && state.data && (
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Suggestions</CardTitle>
            <CardDescription>
              We've analyzed your description. Click on the categories below to select them.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Suggested Categories</h3>
              <div className="flex flex-wrap gap-2">
                {state.data.categories.map((category) => (
                  <Badge
                    key={category}
                    data-state={selectedCategories.includes(category) ? 'selected' : 'unselected'}
                    onClick={() => handleCategoryToggle(category)}
                    className="cursor-pointer text-base px-3 py-1 bg-primary/10 text-primary border-primary/20 transition-colors hover:bg-primary/20 data-[state=selected]:bg-primary data-[state=selected]:text-primary-foreground"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
            <Card className="bg-secondary/50">
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <div className='flex-1'>
                  <CardTitle className="text-base font-semibold">Reasoning</CardTitle>
                  <CardDescription className="text-muted-foreground mt-1">
                    {state.data.reasoning}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="border-t pt-6 flex justify-end">
        <Button type="submit" size="lg">Submit Report</Button>
      </form>
    </div>
  );
}
