'use client';

import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFormState, useFormStatus } from 'react-dom';
import { signUpAction, type SignUpState } from '@/app/auth/actions';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const initialState: SignUpState = {
  success: false,
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</> : 'Create Account'}
    </Button>
  );
}

export function SignUpForm() {
  const [state, formAction] = useFormState(signUpAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success!' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Sign Up</CardTitle>
          <CardDescription>Enter your information to create an account.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="full-name">Full name</Label>
            <Input id="full-name" name="full-name" placeholder="John Doe" required />
            {state.fieldErrors?.fullName && <p className="text-sm font-medium text-destructive">{state.fieldErrors.fullName}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            {state.fieldErrors?.email && <p className="text-sm font-medium text-destructive">{state.fieldErrors.email}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
            {state.fieldErrors?.password && <p className="text-sm font-medium text-destructive">{state.fieldErrors.password}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <SubmitButton />
          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link href="/sign-in" className="underline text-primary">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
