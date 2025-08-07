import { Header } from '@/components/Header';
import { SignUpForm } from '@/components/SignUpForm';

export default function SignUpPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <SignUpForm />
      </main>
    </div>
  );
}
