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
import { toast } from "sonner";
import useTranslation from "@/app/hooks/useTranslation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Define the schema for the form inputs
const formSchema = z.object({
    name: z.string().min(1, { message: "Name field is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    gender: z.string().min(1, { message: "You must choose the gender" }),
    financialNumber: z.string().min(1, { message: "The Financial number field is required" }),
});

// Define the interface for form values based on the schema
interface FormValues {
    name: string;
    email: string;
    gender: string;
    financialNumber: string;
}

type ModifyUserModalProps = {
    isOpen: boolean;
    onClose: () => void;
    stationId: string;
    setData: any;
};

const ModifyUser: React.FC<ModifyUserModalProps> = ({ isOpen, onClose, stationId, setData }) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            gender: '',
            financialNumber: ''

        },
    });

    const onSubmit = async (values: FormValues) => {
        try {
            const { data } = await axios.patch('/api/users', { ...values, user_id: stationId })

            setData(data)
            await axios.post('/api/auth/send_password_setup', { email: values.email });
            onClose()
        } catch (error) {
            console.error(error);
            toast.error('Failed to update user information');
        }
    };

    const { t } = useTranslation()

    const { isSubmitting, isValid } = form.formState;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('Edit information')}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Name')}</FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} placeholder={t('the name')} {...field} />
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
                                    <FormLabel>{t('Mail')}</FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} type="email" placeholder={`${t('Mail')}...`} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gender</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={(value) => field.onChange(value)}
                                            value={field.value}
                                        >
                                            <div className="flex gap-4">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="MALE" id="male" />
                                                    <Label className='cursor-pointer' htmlFor="male">Male</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="FEMALE" id="female" />
                                                    <Label className='cursor-pointer' htmlFor="female">Female</Label>
                                                </div>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="financialNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Financial Number</FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} placeholder="Financial Number" {...field} />
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

export default ModifyUser;
