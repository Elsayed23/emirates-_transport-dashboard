'use client'
import * as React from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { boolean, z } from 'zod';
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
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Define the schema for the form inputs
const formSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(4)
});

// Define the interface for form values based on the schema
interface FormValues {
    name: string;
    email: string;
    password: string
}
type AddUserModalProps = {
    isOpen: boolean;
    onClose: () => void;
    setData: any;
};

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, setData }) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: ''
        },
    });

    const { handleSubmit, reset, formState: { isSubmitting, isValid } } = form;


    const onSubmit = async (values: FormValues) => {
        try {

            const { data } = await axios.post('/api/safety_officer', values)

            setData((prevUsers: any) => {
                return [
                    ...prevUsers,
                    data
                ]
            })


            toast.success('تم إضافة الضابط')
            reset({ ...form.getValues(), name: '', email: '', password: '' });
        } catch (error) {
            console.log(error);

        }

    };


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>إضافة ضابط سلامة</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form dir="rtl" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>الإسم</FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} type="text" placeholder="الإسم..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>البريد</FormLabel>
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
                                    <FormLabel>كلمة المرور</FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} type="password" placeholder="كلمة المرور..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogClose asChild>
                            <Button type="submit">حفظ</Button>
                        </DialogClose>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddUserModal;
