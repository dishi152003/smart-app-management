import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

export function IssueMap() {
  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="relative aspect-video w-full">
          <Image
            src="https://placehold.co/1600x900.png"
            alt="City Map with issue pins"
            data-ai-hint="city map"
            fill
            className="rounded-lg object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
            <div className="text-center p-4 bg-background/80 rounded-lg shadow-xl">
              <h3 className="font-bold text-lg text-foreground">Map Feature Coming Soon</h3>
              <p className="text-muted-foreground mt-1">
                An interactive map to view all reported issues is currently under development.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
