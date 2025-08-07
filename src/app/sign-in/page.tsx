import { Header } from '@/components/Header';
import { SignInForm } from '@/components/SignInForm';

export default function SignInPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <SignInForm />
      </main>
    </div>
  );
}
