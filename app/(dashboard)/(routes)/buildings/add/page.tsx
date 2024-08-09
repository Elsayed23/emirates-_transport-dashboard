'use client';
import React, { useState, useContext, useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectValue } from '@/components/ui/select';
import { SelectTrigger } from '@/components/ui/select';
import useTranslation from '@/app/hooks/useTranslation';
import LanguageContext from '@/app/context/LanguageContext';
import { useRouter, useSearchParams } from 'next/navigation';
import DynamicBreadcrumb from '@/app/(dashboard)/_components/DynamicBreadcrumb';
import AddRisksForm from './_components/AddRisks';
import axios from 'axios';

const formSchema = z.object({
    name: z.string().min(2, { message: "يجب أن يتكون الاسم من حرفين على الأقل" }),
    cityName: z.string().min(2, { message: "يجب أن يتكون إسم المديتة من حرفين على الأقل" }),
});

type FormSchemaType = z.infer<typeof formSchema>;


const page = () => {
    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);
    const router = useRouter();

    const searchParams = useSearchParams();


    const [builtData, setBuiltData] = useState<FormSchemaType | null>(null);
    const [location, setLocation] = useState<{ latitude: number | undefined; longitude: number | undefined }>({ latitude: undefined, longitude: undefined });


    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            cityName: "",
        },
    });

    const handleConfirm = () => {
        const values = form.getValues();
        setBuiltData(values);
    };

    const onSubmit: SubmitHandler<FormSchemaType> = async (values: any) => {
        setBuiltData(values);
    };

    const breadcrumbData = [
        { url: '/buildings', title: 'مخاطر المباني' },
        { title: 'إضافة مبني' },
    ];

    const { setValue, getValues, formState: { isValid, isSubmitting } } = form;


    return (
        <div className='p-6'>
            <DynamicBreadcrumb routes={breadcrumbData} />
            {!builtData ? (
                <div className="min-h-[calc(100vh-148px)] flex justify-center items-center">
                    <div className="border p-4 rounded-md min-w-96 bg-white">
                        <h1 className='text-xl font-semibold text-center mb-4'>{t('Add an itinerary')}</h1>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{'إسم المبني'}</FormLabel>
                                            <FormControl>
                                                <Input placeholder='الإسم...' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="cityName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>إسم المدينة</FormLabel>
                                            <FormControl>
                                                <Input placeholder='الإسم...' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* cityName */}
                                <div className="flex justify-between items-center">
                                    <Button type="submit" disabled={!isValid || isSubmitting}>
                                        {t('Save')}
                                    </Button>
                                    <Button variant='destructive' type='button' onClick={() => router.push(`/buildings`)}>
                                        {t('Cancel')}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            ) : (
                <AddRisksForm builtData={builtData} />
            )}
        </div>
    );
};

export default page;
