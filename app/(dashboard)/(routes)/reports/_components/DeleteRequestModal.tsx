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
import useTranslation from "@/app/hooks/useTranslation";
import LanguageContext from "@/app/context/LanguageContext";

// Define the schema for the form inputs
const formSchema = z.object({
    deleteRequsestReason: z.string().min(1, { message: "Invalid field" }),
});

// Define the interface for form values based on the schema
interface FormValues {
    deleteRequsestReason: string;
}

type DeleteRequestModalProps = {
    isOpen: boolean;
    onClose: () => void;
    inspectionId: string;
    setIsDeleteRequestDone: any;
};

const DeleteRequest: React.FC<DeleteRequestModalProps> = ({ isOpen, onClose, inspectionId, setIsDeleteRequestDone }) => {


    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            deleteRequsestReason: '',
        },
    });

    const onSubmit = async (values: FormValues) => {
        try {
            await axios.post('/api/delete_request', { inspectionId, reason: values.deleteRequsestReason });
            toast.success('Delete request created successfully');
        } catch (error) {
            console.error('Error creating delete request:', error);
            toast.error('Failed to create delete request');
        }
    };


    const { formState: { isSubmitting, isValid } } = form


    const { t } = useTranslation()
    const { language } = React.useContext(LanguageContext)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('Add reason for deletion')}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} dir={language === 'ar' ? 'rtl' : 'ltr'} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="deleteRequsestReason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Reason for deletion')}</FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} placeholder={`${t('Reason for deletion')}...`} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-between items-center">
                            <Button type="submit" disabled={isSubmitting || !isValid}>{t('Save')}</Button>
                            <Button type="button" disabled={isSubmitting} variant='destructive'>{t('Cancel')}</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteRequest;
