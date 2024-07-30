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
    correctiveAction: z.string().min(1, { message: "Invalid field" }),
});

// Define the interface for form values based on the schema
interface FormValues {
    correctiveAction: string;
}

type AddCorrectiveActionModalProps = {
    isOpen: boolean;
    onClose: () => void;
    inspectionId: string;
    correctiveAction: string;
    setIsCorrectiveActionAdded: any;
};

const AddCorrectiveAction: React.FC<AddCorrectiveActionModalProps> = ({ isOpen, onClose, inspectionId, correctiveAction, setIsCorrectiveActionAdded }) => {


    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            correctiveAction: '',
        },
    });

    const onSubmit = async (values: FormValues) => {
        try {

            await axios.patch('/api/corrective_action', { ...values, inspectionId })
            setIsCorrectiveActionAdded((prev: boolean) => !prev)
            onClose()
        } catch (error) {
            console.error(error);
            toast.error('Failed to update user information');
        }
    };


    const { t } = useTranslation()

    const { language } = React.useContext(LanguageContext)

    const { formState: { isSubmitting, isValid }, setValue } = form

    React.useEffect(() => {
        setValue('correctiveAction', correctiveAction)
    }, [isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('Add a corrective action')}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} dir={language === 'ar' ? 'rtl' : 'ltr'} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="correctiveAction"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Corrective action')}</FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} placeholder={`${t('Corrective action')}...`} {...field} />
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

export default AddCorrectiveAction;
