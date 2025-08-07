import { Header } from '@/components/Header';
import { IssueMap } from '@/components/IssueMap';

export default function MapPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <div className="text-center space-y-2 mb-8">
            <h1 className="text-3xl font-bold font-headline">Geographic Issue Display</h1>
            <p className="text-muted-foreground">
              View reported issues across the city on the map below.
            </p>
        </div>
        <IssueMap />
      </main>
    </div>
  );
}
