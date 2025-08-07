'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { z } from 'zod';

const signUpSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
    email: z.string().email('Invalid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export type SignUpState = {
    success: boolean;
    message: string;
    fieldErrors?: {
        fullName?: string[];
        email?: string[];
        password?: string[];
    };
};

export async function signUpAction(prevState: SignUpState, formData: FormData): Promise<SignUpState> {
    const validatedFields = signUpSchema.safeParse({
        fullName: formData.get('full-name'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            message: 'Invalid input.',
            fieldErrors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            validatedFields.data.email,
            validatedFields.data.password
        );
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
            fullName: validatedFields.data.fullName,
            email: validatedFields.data.email,
        });

        return { success: true, message: 'Account created successfully! Please sign in.' };
    } catch (error: any) {
        let message = 'An unknown error occurred.';
        if (error.code === 'auth/email-already-in-use') {
            message = 'This email is already in use.';
        }
        return { success: false, message };
    }
}


const signInSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export type SignInState = {
    success: boolean;
    message: string;
    fieldErrors?: {
        email?: string[];
        password?: string[];
    };
};

export async function signInAction(prevState: SignInState, formData: FormData): Promise<SignInState> {
    const validatedFields = signInSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            message: 'Invalid input.',
            fieldErrors: validatedFields.error.flatten().fieldErrors,
        };
    }
    
    try {
        await signInWithEmailAndPassword(
            auth,
            validatedFields.data.email,
            validatedFields.data.password
        );
        return { success: true, message: 'Signed in successfully!' };
    } catch (error: any) {
        let message = 'An unknown error occurred.';
        if (error.code === 'auth/invalid-credential') {
            message = 'Invalid email or password.';
        }
        return { success: false, message: message };
    }
}
