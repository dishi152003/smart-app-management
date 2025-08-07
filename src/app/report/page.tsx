import { Header } from '@/components/Header';
import { ReportIssueForm } from '@/components/ReportIssueForm';

export default function ReportPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-3xl font-bold font-headline">Report an Issue</h1>
            <p className="text-muted-foreground">
              Describe the issue you've encountered. Our AI can help categorize it for you.
            </p>
          </div>
          <ReportIssueForm />
        </div>
      </main>
    </div>
  );
}
