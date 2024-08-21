'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import axios from "axios";
import { useRouter, useSearchParams } from 'next/navigation';

const formSchema = z.object({
    password: z.string().min(4, { message: "Password must be at least 4 characters." }),
    confirmPassword: z.string().min(4, { message: "Please confirm your password." }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // Specify the path where the error should appear
});

const page = () => {

    const searchParams = useSearchParams();

    const router = useRouter()

    const token = searchParams.get('token');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const { data } = await axios.post('/api/auth/reset_password', { ...values, token });
            const { message } = data;

            toast.success(message);
            router.push('/login');

        } catch (error) {
            toast.error('Failed to reset password. Please try again later.');
            console.error(error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen py-7">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full sm:w-[370px] gap-7 mx-auto">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <Input type="password" disabled={isSubmitting} placeholder="New Password" {...field} />
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
                                    <Input type="password" disabled={isSubmitting} placeholder="Confirm Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmitting || !isValid}>Reset Password</Button>
                </form>
            </Form>
        </div>
    );
};

export default page;
