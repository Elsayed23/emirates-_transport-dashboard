'use client';

import { Input } from "@/components/ui/input";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import useTranslation from "@/app/hooks/useTranslation";
import { useContext } from "react";
import LanguageContext from "@/app/context/LanguageContext";

const formSchema = z.object({
    name: z.string().min(1, { message: "Invalid field." }),
    translationName: z.string().min(1, { message: "Invalid field." }),
    contract: z.string().min(1, { message: "Invalid field." }),
});

const page = ({
    params: { stationId }
}: { params: { stationId: string } }) => {

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            translationName: '',
            contract: '',
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post('/api/school', { ...values, stationId });
            router.push(`/stations/${stationId}`);
        } catch (error) {
            console.error(error);
        }
    };

    const { t } = useTranslation()
    const { language } = useContext(LanguageContext)

    return (
        <div className="p-4">
            <div className="min-h-[calc(100vh-148px)] flex justify-center items-center">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full sm:w-[370px] gap-7 mx-auto">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('School name')}</FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} placeholder={t('the name')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="translationName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Translation name')}</FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} placeholder={t('the name')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contract"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Contract')}</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={isSubmitting}
                                        >
                                            <SelectTrigger dir={language === 'ar' ? 'rtl' : 'ltr'}>
                                                <SelectValue placeholder={t('Select a contract')} />
                                            </SelectTrigger>
                                            <SelectContent dir={language === 'ar' ? 'rtl' : 'ltr'}>
                                                <SelectGroup>
                                                    <SelectLabel>{t('Contracts')}</SelectLabel>
                                                    <SelectItem value="مؤسسة الامارات للتعليم">{t('Emirates Education Foundation')}</SelectItem>
                                                    <SelectItem value="اخري">{t('Other')}</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting || !isValid}>{t('Save')}</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default page;
