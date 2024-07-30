"use client";
import React, { useContext, useEffect, useState } from 'react';
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import LanguageContext from '@/app/context/LanguageContext';
import useTranslation from '@/app/hooks/useTranslation';
import { stationsData } from '@/app/constants';
import Loading from '@/app/(dashboard)/_components/Loading';
import { useAuth } from '@/app/context/AuthContext';

const formSchema = z.object({
    userId: z.string().min(1),
    stationId: z.string().min(1),
    inspectionTypeId: z.string().min(1),
    city: z.string().min(1),
    nameOfSchool: z.string().min(1),
});

const CreateReportForm = ({ setReportData, }) => {
    const router = useRouter();
    const { language } = useContext(LanguageContext);
    const { t } = useTranslation();
    const [inspectionTypesData, setInspectionTypesData] = useState([]);

    const { user } = useAuth();
    const searchParams = useSearchParams();
    const inspection_id = searchParams.get('inspection_id');

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userId: user?.id || '',
            stationId: '',
            nameOfSchool: '',
            inspectionTypeId: inspection_id || '',
            city: '',
        },
    });

    const { isSubmitting, isValid } = form.formState;


    const getInspectionTypes = async () => {

        try {

            const { data } = await axios.get('/api/inspection_types')

            if (!inspection_id) {
                setInspectionTypesData(data?.filter((inspection) => {
                    return inspection?.name !== 'Inspection of electronic control'
                }))
            } else {
                setInspectionTypesData(data?.filter((inspection) => {
                    return inspection?.name === 'Inspection of electronic control'
                }))
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getInspectionTypes();
    }, []);

    useEffect(() => {
        if (user) {
            form.setValue('userId', user.id);
        }
    }, [user]);

    const onSubmit = async (values) => {
        setReportData(values);
    };

    if (!inspectionTypesData) return <Loading />;

    return (
        <div className='p-6'>
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
                                                {stationsData.map((station, idx) => (
                                                    <SelectItem key={idx} value={station?.id?.toString()}>{language === 'ar' ? station?.name : station?.translationName}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <Label className='mb-4' htmlFor='inspectionTypeId'>{t('Inspection type')}</Label>
                            <FormField
                                control={form.control}
                                name="inspectionTypeId"
                                render={({ field }) => (
                                    <FormItem>
                                        <Select disabled={inspection_id ? true : false} onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl className='mb-5' dir={language === 'ar' ? 'rtl' : 'ltr'}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('Select the Inspection type')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent dir={language === 'ar' ? 'rtl' : 'ltr'}>
                                                {inspectionTypesData.map(({ id, name }, idx) => (
                                                    <SelectItem key={idx} value={id}>{t(name)}</SelectItem>
                                                ))}
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
                            <div className='flex justify-between items-center gap-2 mt-4'>
                                <Button onClick={() => { router.push('/reports') }} variant='destructive'>{t('Cancel')}</Button>
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

export default CreateReportForm;