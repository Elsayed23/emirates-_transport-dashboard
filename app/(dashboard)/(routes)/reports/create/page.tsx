'use client';
import React, { useContext, useEffect, useState } from 'react';
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { Check, ChevronsUpDown } from "lucide-react";

import {
    Input
} from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import toast from 'sonner';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { stationsData } from '@/app/constants';
import LanguageContext from '@/app/context/LanguageContext';
import { useAuth } from '@/app/context/AuthContext';
import useTranslation from '@/app/hooks/useTranslation';
import DynamicBreadcrumb from '@/app/(dashboard)/_components/DynamicBreadcrumb';
import Loading from '@/app/(dashboard)/_components/Loading';

const formSchema = z.object({
    userId: z.string().min(1),
    stationId: z.string().min(1),
    inspectionTypeId: z.string().min(1),
    city: z.string().min(1),
    nameOfSchool: z.string().min(1),

});

interface InspectionTypes {
    id: string;
    name: string;
}

const page = () => {
    const router = useRouter();

    const { language } = useContext(LanguageContext);

    const { user } = useAuth()

    const [inspectionTypesData, setInspectionTypesData] = useState<InspectionTypes[] | null>(null)

    const getInspectionTypes = async () => {

        try {

            const { data } = await axios.get('/api/inspection_types')

            setInspectionTypesData(data)

        } catch (error) {
            console.log(error);
        }
    }


    const { t } = useTranslation()


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userId: user?.id,
            stationId: '',
            nameOfSchool: '',
            inspectionTypeId: '',
            city: '',
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const { setValue } = form


    const stations = stationsData.map((station: any, idx: number) => {
        return (
            <SelectItem key={idx} value={station?.id?.toString()}>{language === 'ar' ? station?.name : station?.translationName}</SelectItem>
        )
    })

    const inspectionTypes = inspectionTypesData?.map(({ id, name }: { id: string, name: string }, idx: number) => {
        return (
            <SelectItem key={idx} value={id}>{t(name)}</SelectItem>

        )
    })

    useEffect(() => {
        getInspectionTypes()
    }, [])

    useEffect(() => {
        setValue('userId', user?.id)
    }, [user])

    const breadcrumbData = [
        {
            url: '/reports',
            title: t('reports')
        },
        {
            title: t('Create a report')
        }
    ]





    const onSubmit = async (values: z.infer<typeof formSchema>) => {

        const nameOfStation: any = stationsData.find(({ id }) => id === Number(values.stationId))?.translationName


        try {
            const { data } = await axios.post('/api/reports', { ...values, nameOfStation: nameOfStation })

            console.log(data);


            router.push(`/reports/${data?.id}/inspections/create`)

        } catch (error) {
            console.error(error);
        }
    };

    if (!inspectionTypesData) return <Loading />

    return (
        <div className='p-6'>
            <DynamicBreadcrumb routes={breadcrumbData} />
            <div className="flex justify-center items-center h-[calc(100vh-148px)]">
                <div className='mb-6 border bg-slate-100 rounded-md p-4 max-w-lg w-full mx-auto'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                            <Label className='mb-4' htmlFor='stationId'>{t('The station')}</Label>

                            <FormField
                                control={form.control}
                                name="stationId"
                                render={({ field }) => (
                                    <FormItem>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl className='mb-5' dir={language === 'ar' ? 'rtl' : 'ltr'}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('Select the station')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent dir={language === 'ar' ? 'rtl' : 'ltr'}>
                                                {stations}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            <Label className='mb-4' htmlFor='nameOfSchool'>{t('Inspection type')}</Label>
                            <FormField
                                control={form.control}
                                name="inspectionTypeId"
                                render={({ field }) => (
                                    <FormItem>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl className='mb-5' dir={language === 'ar' ? 'rtl' : 'ltr'}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('Select the Inspection type')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent dir={language === 'ar' ? 'rtl' : 'ltr'}>
                                                {inspectionTypes}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <Label className='mb-4' htmlFor='nameOfSchool'>{t('School name')}</Label>
                            <FormField
                                control={form.control}
                                name='nameOfSchool'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                className='mb-5'
                                                id='nameOfSchool'
                                                disabled={isSubmitting}
                                                placeholder={t('the name')}
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Label className='mb-4' htmlFor='city'>{t('City name')}</Label>
                            <FormField
                                control={form.control}
                                name='city'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                className='mb-5'
                                                id='city'
                                                disabled={isSubmitting}
                                                placeholder={t('the name')}
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            {/*
                        <Label className='mb-4' htmlFor='InspectionSite'>موقع التفتيش</Label>
                        <FormField
                            control={form.control}
                            name='InspectionSite'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            className='mb-5'
                                            id='InspectionSite'
                                            disabled={isSubmitting}
                                            placeholder="الموقع..."
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Label className='mb-4' htmlFor='jobTitleOfTheEmployee'>إسم وظيفة العامل</Label>

                        <FormField
                            control={form.control}
                            name='jobTitleOfTheEmployee'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            className='mb-5'
                                            id='jobTitleOfTheEmployee'
                                            disabled={isSubmitting}
                                            placeholder="إسم الوظيفة..."
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Label className='mb-4' htmlFor='employeeName'>إسم العامل الي بيعمل التفتيش هخهخ</Label>
                        <FormField
                            control={form.control}
                            name='employeeName'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            className='mb-5'
                                            id='employeeName'
                                            disabled={isSubmitting}
                                            placeholder="إسم العامل..."
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        /> */}
                            {/* <Label className='mb-4' htmlFor='image'>Images</Label>

                        <div {...getRootProps({ className: 'dropzone' })} className="border-dashed border-2 p-4 text-center cursor-pointer">
                            <input id='image' {...getInputProps()} />
                            <p>Drag 'n' drop some files here, or click to select files</p>
                            <aside style={thumbsContainer}>
                                {thumbs}
                            </aside>
                        </div> */}

                            <div className='flex justify-between items-center gap-2 mt-4'>
                                <Button onClick={() => { router.push('/instruments') }} variant='destructive'>{t('Cancel')}</Button>
                                <Button
                                    type='submit'
                                    disabled={isSubmitting || !isValid}
                                >
                                    {t('Save')}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default page;
