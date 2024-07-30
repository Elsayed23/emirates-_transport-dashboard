'use client';
import * as React from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";

// Define the schema for the form inputs
const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(4, { message: "Password must be at least 6 characters long" }),
});

// Define the interface for form values based on the schema
interface FormValues {
    email: string;
    password: string;
}

type ModifyUserModalProps = {
    isOpen: boolean;
    onClose: () => void;
    stationId: string;
    setData: any;
};

const ModifyUser: React.FC<ModifyUserModalProps> = ({ isOpen, onClose, stationId, setData }) => {


    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values: FormValues) => {
        try {
            const { data } = await axios.patch('/api/users', { ...values, user_id: stationId })

            setData(data)
            onClose()
        } catch (error) {
            console.error(error);
            toast.error('Failed to update user information');
        }
    };

    const { isSubmitting } = form.formState;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Modify User Information</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>البريد الجديد</FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} type="email" placeholder="البريد..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>كلمة المرور الجديدة</FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} type="password" placeholder="كلمة المرور..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogClose asChild>
                            <Button type="submit" disabled={isSubmitting}>Save</Button>
                        </DialogClose>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ModifyUser;
