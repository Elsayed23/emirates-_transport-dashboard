'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

const formSchema = z.object({
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string().min(6, { message: "Please confirm your password." }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

interface FormValues {
    password: string;
    confirmPassword: string;
}

const page: React.FC = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const token = searchParams.get('token');

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const { handleSubmit, formState: { isSubmitting, isValid } } = form;

    const onSubmit = async (values: FormValues) => {
        try {
            const response = await axios.post('/api/auth/set_password', {
                token,
                password: values.password,
            });

            if (response.status === 200) {
                toast.success('Password set successfully!');
                router.push('/login');
            } else {
                toast.error(response.data.message || 'Failed to set password.');
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full max-w-md gap-6 p-6 border rounded shadow-md">
                    <h1 className="text-2xl font-bold text-center">Set Your Password</h1>
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Enter your new password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Confirm your new password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmitting || !isValid} className="w-full">
                        Set Password
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default page;
