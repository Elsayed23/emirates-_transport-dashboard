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

    const { formState: { isSubmitting, isValid }, setValue } = form

    React.useEffect(() => {
        setValue('correctiveAction', correctiveAction)
    }, [isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>إضافة إجراء تصحيحي</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} dir="rtl" className="space-y-8">
                        <FormField
                            control={form.control}
                            name="correctiveAction"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>الإجراء التصحيحي</FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} placeholder="الإجراء التصحيحي..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting || !isValid}>{t('Save')}</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddCorrectiveAction;
