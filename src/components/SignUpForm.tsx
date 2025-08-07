import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function SignUpForm() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Sign Up</CardTitle>
        <CardDescription>Enter your information to create an account.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="full-name">Full name</Label>
          <Input id="full-name" placeholder="John Doe" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full">Create Account</Button>
        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link href="/sign-in" className="underline text-primary">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
