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
import { Input } from "@/components/ui/input";
import axios from "axios";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import useTranslation from "@/app/hooks/useTranslation";
import LanguageContext from '@/app/context/LanguageContext';

enum TaskEnum {
    TRAFFIC_LINE_HAZARDS = "TRAFFIC_LINE_HAZARDS",
    BUILDINGS_HAZARDS = "BUILDINGS_HAZARDS",
    ELECTRONIC_SURVEILLANCE_REPORT = "ELECTRONIC_SURVEILLANCE_REPORT",
    BUILDINGS_REPORT = "BUILDINGS_REPORT",
    BUSES_REPORT = "BUSES_REPORT"
}

const formSchema = z.object({
    name: z.nativeEnum(TaskEnum, { errorMap: () => ({ message: "Please select a valid task name" }) }),
    frequency: z.string().min(1, { message: "Please select a frequency" }),
    taskCount: z.string(),
    note: z.string().optional()
});

interface FormValues {
    name: string;
    frequency: string;
    taskCount: string;
    note: string;
}

type AddTaskModalProps = {
    isOpen: boolean;
    onClose: () => void;
    user_id: any;
};

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, user_id }) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            frequency: '',
            taskCount: '',
            note: ''
        },
    });

    const { handleSubmit, reset, formState: { isSubmitting, isValid } } = form;

    const onSubmit = async (values: FormValues) => {
        try {
            // إرسال البيانات مع user_id إلى الواجهة الخلفية
            const { data } = await axios.post(`/api/tasks`, { ...values, user_id });

            console.log(values);
            onClose();
            toast.success(data?.message);
            reset({ ...form.getValues(), name: '', frequency: '', taskCount: '', note: '' });
        } catch (error) {
            console.log(error);
            toast.error('Failed to add task');
        }
    };

    const { t } = useTranslation();
    const { language } = React.useContext(LanguageContext)

    const makeDIR = language === 'ar' ? 'rtl' : 'ltr'

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('Adding Task')}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form dir={makeDIR} onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Task Name')}</FormLabel>
                                    <FormControl>
                                        <Select
                                            dir={makeDIR}
                                            onValueChange={(value) => field.onChange(value)}
                                            value={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Select a task')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={TaskEnum.TRAFFIC_LINE_HAZARDS}>{t('Traffic Line Hazards')}</SelectItem>
                                                <SelectItem value={TaskEnum.BUILDINGS_HAZARDS}>{t('Buildings Hazards')}</SelectItem>
                                                <SelectItem value={TaskEnum.ELECTRONIC_SURVEILLANCE_REPORT}>{t('Electronic Surveillance Report')}</SelectItem>
                                                <SelectItem value={TaskEnum.BUILDINGS_REPORT}>{t('Buildings Report')}</SelectItem>
                                                <SelectItem value={TaskEnum.BUSES_REPORT}>{t('Buses Report')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="taskCount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>taskCount</FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} type="number" placeholder='taskCount' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="frequency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Frequency')}</FormLabel>
                                    <FormControl>
                                        <Select
                                            dir={makeDIR}
                                            onValueChange={(value) => field.onChange(value)}
                                            value={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Select a frequency')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="MONTHLY">{t('Monthly')}</SelectItem>
                                                <SelectItem value="DAILY">{t('Daily')}</SelectItem>
                                                <SelectItem value="QUARTERLY">{t('Quarterly')}</SelectItem>
                                                <SelectItem value="INDIVIDUAL">{t('Individual')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Note (optional)</FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} type="text" placeholder='note' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-between items-center" dir="ltr">
                            <Button type="button" onClick={onClose} disabled={isSubmitting} variant='destructive'>{t('Cancel')}</Button>
                            <Button type="submit" disabled={isSubmitting || !isValid}>{t('Save')}</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddTaskModal;
