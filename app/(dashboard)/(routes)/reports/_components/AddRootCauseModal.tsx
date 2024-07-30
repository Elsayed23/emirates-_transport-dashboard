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
    }, [isOpen])

    const { t } = useTranslation()
    const { language } = React.useContext(LanguageContext)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('Adding a root cause')}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} dir={language === 'ar' ? 'rtl' : 'ltr'} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="rootCause"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Root cause')}</FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} placeholder={`${t('Root cause')}...`} {...field} />
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

export default AddRootCause;
