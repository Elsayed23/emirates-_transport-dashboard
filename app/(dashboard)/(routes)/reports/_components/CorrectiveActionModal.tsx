'use client';
import * as React from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Dialog,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from "axios";
import { toast } from "sonner";
import useTranslation from "@/app/hooks/useTranslation";
import LanguageContext from "@/app/context/LanguageContext";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea component

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
    noteId: string;
    setIsCorrectiveActionAdded: any;
};

const AddCorrectiveAction: React.FC<AddCorrectiveActionModalProps> = ({ isOpen, onClose, inspectionId, noteId, setIsCorrectiveActionAdded }) => {

    const [correctiveActions, setCorrectiveActions] = React.useState<any[]>([]);
    const [showCustomInput, setShowCustomInput] = React.useState<boolean>(false); // State to toggle custom input

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            correctiveAction: '',
        },
    });

    // Fetch corrective actions for the noteId
    React.useEffect(() => {
        const fetchCorrectiveActions = async () => {
            try {
                const { data } = await axios.get(`/api/corrective_action/${noteId}`);
                setCorrectiveActions(data || []);
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch corrective actions');
            }
        };

        if (isOpen) {
            fetchCorrectiveActions();
            setShowCustomInput(false)
        }
    }, [isOpen, noteId]);

    const onSubmit = async (values: FormValues) => {
        try {
            await axios.patch('/api/corrective_action', { ...values, inspectionId });
            setIsCorrectiveActionAdded((prev: boolean) => !prev);
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Failed to update corrective action');
        }
    };

    const { t } = useTranslation();
    const { language } = React.useContext(LanguageContext);
    const { formState: { isSubmitting, isValid }, setValue } = form;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] max-h-[460px] overflow-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <DialogHeader>
                    <DialogTitle>{t('Add a corrective action')}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} dir={language === 'ar' ? 'rtl' : 'ltr'} className="space-y-8">
                        {!showCustomInput ? (
                            <FormField
                                control={form.control}
                                name="correctiveAction"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('Select a corrective action')}</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={(value) => field.onChange(value)}
                                                value={field.value}
                                            >
                                                {correctiveActions.map(action => (
                                                    <div key={action.id} dir={language === 'ar' ? 'rtl' : 'ltr'} className="flex items-center gap-3 border-y py-2">
                                                        <RadioGroupItem className="w-fit" value={action.ar} id={action.id} />
                                                        <Label className="cursor-pointer" htmlFor={action.id}>{language === 'ar' ? action.ar : action.en}</Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ) : (
                            <FormField
                                control={form.control}
                                name="correctiveAction"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('Enter a custom corrective action')}</FormLabel>
                                        <FormControl>
                                            <Textarea disabled={isSubmitting} placeholder={`${t('Corrective action')}...`} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowCustomInput(!showCustomInput)}
                        >
                            {showCustomInput ? t('Choose from list') : t('Enter custom action')}
                        </Button>
                        <div className="flex justify-between items-center">
                            <Button type="submit" disabled={isSubmitting || !isValid}>{t('Save')}</Button>
                            <Button type="button" disabled={isSubmitting} variant='destructive' onClick={onClose}>{t('Cancel')}</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddCorrectiveAction;
