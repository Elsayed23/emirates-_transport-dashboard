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

const formSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(4),
    roleId: z.string().min(1, { message: "Please select a role" }),
});

interface FormValues {
    name: string;
    email: string;
    password: string;
    roleId: string;
}

type AddUserModalProps = {
    isOpen: boolean;
    onClose: () => void;
    setData: any;
};

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, setData }) => {
    const [roles, setRoles] = React.useState<{ id: string; name: string }[]>([]);
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            roleId: '',
        },
    });

    const { handleSubmit, reset, formState: { isSubmitting, isValid } } = form;

    React.useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('/api/roles');
                setRoles(response.data);
            } catch (error) {
                console.error('Error fetching roles:', error);
                toast.error('Failed to fetch roles');
            }
        };

        fetchRoles();
    }, []);

    const onSubmit = async (values: FormValues) => {
        try {
            const { data } = await axios.post('/api/users', values)

            setData((prevUsers: any) => {
                return [
                    ...prevUsers,
                    data?.data
                ]
            })
            console.log(values);

            onClose();
            toast.success(data?.message)
            reset({ ...form.getValues(), name: '', email: '', password: '', roleId: '' });
        } catch (error) {
            console.log(error);
        }
    };

    const { t } = useTranslation();
    const { language } = React.useContext(LanguageContext)

    const makeDIR = language === 'ar' ? 'rtl' : 'ltr'

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('Adding user')}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form dir={makeDIR} onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Name')}</FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} type="text" placeholder={`${t('Name')}...`} {...field} />
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
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Password')}</FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} type="password" placeholder={`${t('Password')}...`}  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="roleId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Role')}</FormLabel>
                                    <FormControl>
                                        <Select
                                            dir={makeDIR}
                                            onValueChange={(value) => field.onChange(value)}
                                            value={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Select a role')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roles.map((role) => (
                                                    <SelectItem key={role.id} value={role.id}>
                                                        {t(`roles.${role.name}`)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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

export default AddUserModal;
