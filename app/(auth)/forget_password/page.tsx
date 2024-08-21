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

const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
});

const page = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const { data } = await axios.post('/api/auth/forgot_password', values);
            const { message } = data;

            toast.success(message);

        } catch (error) {
            toast.error('Failed to send reset link. Please try again later.');
            console.error(error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen py-7">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full sm:w-[370px] gap-7 mx-auto">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input disabled={isSubmitting} placeholder="Enter your email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmitting || !isValid}>Send Reset Link</Button>
                </form>
            </Form>
        </div>
    );
};

export default page;
