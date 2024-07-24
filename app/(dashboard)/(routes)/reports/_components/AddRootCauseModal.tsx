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
    rootCause: z.string().min(1, { message: "Invalid field" }),
});

// Define the interface for form values based on the schema
interface FormValues {
    rootCause: string;
}

type AddRootCauseModalProps = {
    isOpen: boolean;
    onClose: () => void;
    inspectionId: string;
    rootCause: string;
    setIsRootCauseAdded: any;
};

const AddRootCause: React.FC<AddRootCauseModalProps> = ({ isOpen, onClose, inspectionId, rootCause, setIsRootCauseAdded }) => {


    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            rootCause: '',
        },
    });

    const onSubmit = async (values: FormValues) => {
        try {

            await axios.patch('/api/root_cause', { ...values, inspectionId })
            setIsRootCauseAdded((prev: boolean) => !prev)
            onClose()
        } catch (error) {
            console.error(error);
            toast.error('Failed to update user information');
        }
    };


    const { formState: { isSubmitting, isValid }, setValue } = form

    React.useEffect(() => {
        setValue('rootCause', rootCause)
    }, [rootCause])



    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>إضافة سبب جذري</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} dir="rtl" className="space-y-8">
                        <FormField
                            control={form.control}
                            name="rootCause"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>السبب الجذري</FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} placeholder="السبب الجذري..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogClose asChild>
                            <Button type="submit" disabled={isSubmitting || !isValid}>Save</Button>
                        </DialogClose>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddRootCause;
