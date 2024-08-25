'use client';

import * as React from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { toast } from "sonner";
import useTranslation from "@/app/hooks/useTranslation";
import LanguageContext from "@/app/context/LanguageContext";

const formSchema = z.object({
    requirementId: z.string().min(1, { message: "Invalid field" }),
    noteId: z.string().min(1, { message: "Invalid field" }),
});

interface FormValues {
    requirementId: string;
    noteId: string;
}

type UpdateInspectionModalProps = {
    isOpen: boolean;
    onClose: () => void;
    inspectionId: string;
    requirementId: string;
    noteId: string;
    inspectionTypeId: string;
    setInspectionUpdated: any;
};

const UpdateInspectionModal: React.FC<UpdateInspectionModalProps> = ({
    isOpen,
    onClose,
    inspectionId,
    requirementId,
    noteId,
    inspectionTypeId,
    setInspectionUpdated
}) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            requirementId: '',
            noteId: '',
        },
    });

    const [requirementData, setRequirementData] = React.useState<any>([]);
    const [availableNotes, setAvailableNotes] = React.useState<any[]>([]);
    const [selectedNote, setSelectedNote] = React.useState<{ ar: string; en: string } | null>(null);

    const getRequirement = async () => {
        try {
            const { data } = await axios.get(`/api/requirement/${inspectionTypeId}`);
            setRequirementData(data);
        } catch (error) {
            console.log(error);
        }
    };

    React.useEffect(() => {
        getRequirement();
    }, [inspectionTypeId]);

    const onSubmit = async (values: FormValues) => {
        try {

            await axios.patch('/api/update_inspection_details', { ...values, inspectionId });
            setInspectionUpdated((prev: boolean) => !prev);
            onClose();
            toast.success('Inspection details updated successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update inspection details');
        }
    };

    const { formState: { isSubmitting, isValid }, setValue, watch } = form;

    React.useEffect(() => {
        setValue('requirementId', requirementId);
        setValue('noteId', noteId);
    }, [isOpen]);
    // noteId, requirementId, inspectionId
    React.useEffect(() => {
        const selectedRequirement = watch('requirementId');
        const selectedRequirementData = requirementData.find((req: any) => req.id === selectedRequirement);
        const notes = selectedRequirementData?.notes || [];
        setAvailableNotes(notes);
    }, [watch('requirementId'), requirementData]);

    const { t } = useTranslation();
    const { language } = React.useContext(LanguageContext);

    const makeDIR = language === "ar" ? "rtl" : "ltr";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('Update Inspection Requirement')}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} dir={makeDIR} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="requirementId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Requirement')}</FormLabel>
                                    <FormControl>
                                        <Select
                                            dir={makeDIR}
                                            onValueChange={(value) => {
                                                setValue('requirementId', value);
                                                setValue('noteId', '');
                                                setSelectedNote(null);
                                            }}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Select the requirement')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {requirementData.map((data: any, idx: number) => (
                                                    <SelectItem key={data.id} value={data.id}>
                                                        {language === "ar"
                                                            ? data.requirement.split("|")[1]
                                                            : data.requirement.split("|")[0]}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="noteId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Description')}</FormLabel>
                                    <FormControl>
                                        <Select
                                            dir={makeDIR}
                                            onValueChange={(value) => {
                                                setValue('noteId', value);
                                                const note = availableNotes.find(note => note.id === value);
                                                setSelectedNote(note || null);
                                            }}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Select the description')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableNotes.map((note, index) => (
                                                    <SelectItem key={note.id} value={note.id}>
                                                        {language === "ar" ? note.ar : note.en}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-between items-center" dir='ltr'>
                            <Button type="button" onClick={onClose} disabled={isSubmitting} variant='destructive'>{t('Cancel')}</Button>
                            <Button type="submit" disabled={isSubmitting || !isValid}>{t('Save')}</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateInspectionModal;
