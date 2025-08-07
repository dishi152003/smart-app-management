'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { getCategorySuggestions, submitIssueReport, type SuggestionState } from '@/app/report/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wand2, AlertTriangle, Lightbulb, Loader2, Upload, MapPin } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

const initialSuggestionState: SuggestionState = {
  success: false,
};

const initialReportState = {
  success: false,
  message: '',
};

function SuggestionSubmitButton() {
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

function ReportSubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" size="lg" disabled={pending}>
        {pending ? (
            <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
            </>
        ) : (
            'Submit Report'
        )}
        </Button>
    );
}


export function ReportIssueForm() {
  const [suggestionState, suggestionAction] = useFormState(getCategorySuggestions, initialSuggestionState);
  const [reportState, reportAction] = useFormState(submitIssueReport, initialReportState);
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setPhoto(loadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
        toast({
            title: "Location Acquired",
            description: "Your current location has been successfully fetched.",
        });
      },
      (error) => {
        console.error("Error getting location", error);
        setIsLocating(false);
        toast({
            variant: "destructive",
            title: "Location Error",
            description: "Could not fetch your location. Please ensure you've granted permission.",
        });
      }
    );
  };
  
  useEffect(() => {
    if (suggestionState.success && suggestionState.data) {
        setSelectedCategories(suggestionState.data.categories);
    }
  }, [suggestionState.success, suggestionState.data]);

  useEffect(() => {
    if (reportState.message) {
      toast({
        title: reportState.success ? "Issue Reported!" : "Error",
        description: reportState.message,
        variant: reportState.success ? "default" : "destructive",
      });
    }
  }, [reportState, toast]);

  return (
    <div className="space-y-6">
      <form action={suggestionAction} className="space-y-4">
        <input type="hidden" name="photo" value={photo || ''} />
        <div>
          <Label htmlFor="description" className="text-base">Issue Description</Label>
          <Textarea
            id="description"
            name="description"
            ref={descriptionRef}
            placeholder="For example: 'The street lights on Main Street have been flickering for the past week.'"
            rows={5}
            required
            className="mt-2"
          />
          {suggestionState.fieldErrors?.description && (
            <p className="text-sm font-medium text-destructive mt-1">{suggestionState.fieldErrors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="photo-upload" className="text-base">Upload Photo</Label>
                <input type="file" id="photo-upload" accept="image/*" onChange={handlePhotoUpload} ref={fileInputRef} className="hidden" />
                <Button type="button" variant="outline" className="w-full mt-2" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    {photo ? "Change Photo" : "Select Photo"}
                </Button>
                {photo && (
                    <div className="mt-2 relative aspect-video">
                        <Image src={photo} alt="Preview" fill className="rounded-md object-cover" />
                    </div>
                )}
            </div>
            <div>
                <Label htmlFor="location" className="text-base">Location</Label>
                <Button type="button" variant="outline" className="w-full mt-2" onClick={handleGetLocation} disabled={isLocating}>
                    {isLocating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
                    {location ? "Update Location" : "Use My Location"}
                </Button>
                {location && <p className="text-sm text-muted-foreground mt-2">Lat: {location.lat.toFixed(5)}, Lng: {location.lng.toFixed(5)}</p>}
            </div>
        </div>

        <SuggestionSubmitButton />
      </form>

      {suggestionState.error && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <div>
              <CardTitle className="text-destructive text-lg">Error</CardTitle>
              <CardDescription className="text-destructive/80">{suggestionState.error}</CardDescription>
            </div>
          </CardHeader>
        </Card>
      )}

      {suggestionState.success && suggestionState.data && (
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
                {suggestionState.data.categories.map((category) => (
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
                    {suggestionState.data.reasoning}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </CardContent>
        </Card>
      )}

      <form action={reportAction} className="border-t pt-6 flex justify-end">
        {/* Pass all data to the submission action */}
        <input type="hidden" name="description" value={descriptionRef.current?.value || ''} />
        {selectedCategories.map(cat => <input key={cat} type="hidden" name="categories[]" value={cat} />)}
        <input type="hidden" name="photo" value={photo || ''} />
        {location && (
            <>
                <input type="hidden" name="lat" value={location.lat} />
                <input type="hidden" name="lng" value={location.lng} />
            </>
        )}
        <ReportSubmitButton />
      </form>
    </div>
  );
}
