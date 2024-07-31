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
import busInspectionNotes from "@/app/constants/busInspectionNotes.json";
import buildingInspectionNotes from "@/app/constants/buildingInspectionNotes.json";
import ESInotes from "@/app/constants/electronicSurveillanceInspectionNotes.json";

const formSchema = z.object({
    requirement: z.string().min(1, { message: "Invalid field" }),
    description: z.string().min(1, { message: "Invalid field" }),
});

interface FormValues {
    requirement: string;
    description: string;
}

type UpdateInspectionModalProps = {
    isOpen: boolean;
    onClose: () => void;
    inspectionId: string;
    requirement: string;
    description: string;
    inspectionTypeName: string;
    setInspectionUpdated: any;
};

const UpdateInspectionModal: React.FC<UpdateInspectionModalProps> = ({
    isOpen,
    onClose,
    inspectionId,
    requirement,
    description,
    inspectionTypeName,
    setInspectionUpdated
}) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            requirement: '',
            description: '',
        },
    });

    const noteData = inspectionTypeName === "Inspection of electronic control"
        ? ESInotes
        : inspectionTypeName === "Inspection of safety procedures on school buses"
            ? busInspectionNotes
            : buildingInspectionNotes;

    const [availableNotes, setAvailableNotes] = React.useState<any[]>([]);
    const [selectedNote, setSelectedNote] = React.useState<{ ar: string; en: string } | null>(null);

    const onSubmit = async (values: FormValues) => {
        try {
            await axios.patch('/api/update_inspection_details', { ...values, inspectionId, enDescription: selectedNote?.en });
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
        setValue('requirement', requirement);
        setValue('description', description);
    }, [isOpen]);

    React.useEffect(() => {
        const selectedRequirement = watch('requirement');
        const notes = noteData.find(note => note.requirement === selectedRequirement)?.notes || [];
        setAvailableNotes(notes);
    }, [watch('requirement')]);

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
                            name="requirement"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Requirement')}</FormLabel>
                                    <FormControl>
                                        <Select
                                            dir={makeDIR}
                                            onValueChange={(value) => {
                                                setValue('requirement', value);
                                                setValue('description', '');
                                                setSelectedNote(null);
                                            }}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Select the requirement')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {noteData.map((data, idx) => (
                                                    <SelectItem key={data.requirement + idx} value={data.requirement}>
                                                        {language === "ar"
                                                            ? data.requirement.split("|")[0]
                                                            : data.requirement.split("|")[1]}
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
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Description')}</FormLabel>
                                    <FormControl>
                                        <Select
                                            dir={makeDIR}
                                            onValueChange={(value) => {
                                                setValue('description', value);
                                                const note = availableNotes.find(note => note.ar === value);
                                                setSelectedNote(note || null);
                                            }}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Select the description')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableNotes.map((note, index) => (
                                                    <SelectItem key={note.ar + index} value={note.ar}>
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
