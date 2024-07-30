'use client';
import React, { useContext } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSpecificSchoolName, getSpecificStationName } from '@/app/simple_func/getSpecificData'
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectValue } from '@/components/ui/select';
import { SelectTrigger } from '@/components/ui/select';
import useTranslation from '@/app/hooks/useTranslation';
import LanguageContext from '@/app/context/LanguageContext';
import { useRouter } from 'next/navigation';
import DynamicBreadcrumb from '@/app/(dashboard)/_components/DynamicBreadcrumb';

const formSchema = z.object({
    name: z.string().min(2, { message: "يجب أن يتكون الاسم من حرفين على الأقل" }),
    schoolId: z.number().int(),
    schoolName: z.string(),
    stationId: z.number().int(),
    stationName: z.string(),
    educationalLevel: z.string().min(1, { message: 'الرجاء إختيار الحلقة' }),
    countOfStudents: z.number().int().min(1, { message: 'أقل عدد طلاب هو 1' }),
    transferredCategory: z.string().min(1, { message: 'الرجاء إختيار اللفئة المنقولة' }),
});


const CreateTrafficLineForm = ({ setTrafficLineData, params: { stationId, schoolId } }: any) => {
    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);

    const { arStationName, enStationName }: { arStationName: string; enStationName: string } = getSpecificStationName(stationId)

    const { arSchoolName, enSchoolName }: { arSchoolName: string; enSchoolName: string } = getSpecificSchoolName(stationId, schoolId)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            schoolId: Number(schoolId),
            schoolName: arSchoolName,
            stationId: Number(stationId),
            stationName: arStationName,
            educationalLevel: "",
            countOfStudents: 0,
            transferredCategory: "",
        },
    });
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        setTrafficLineData(values);
    };

    const educationalLevelData = ['First episode', 'Second episode', 'Third episode', 'Kindergarten', 'Multiple episodes (two or more episodes)', 'Several episodes with kindergarten'];
    const transferredCategoryData = ['Males', 'Females', 'Mixed'];

    const router = useRouter()

    const breadcrumbData = [
        {
            url: '/stations',
            title: t('stations')
        },
        {
            url: `/stations/${stationId}`,
            title: t(`stationsData.${enStationName}`)
        },
        {
            url: `/stations/${stationId}/school/${schoolId}`,
            title: language === 'ar' ? arSchoolName : enSchoolName
        },
        {
            title: t('Add an itinerary')
        }
    ]

    const { setValue, getValues, formState: { isValid, isSubmitting } } = form

    return (
        <div className='p-6'>
            <DynamicBreadcrumb routes={breadcrumbData} />
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
                                        <FormLabel>{t('name of itinerary')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('the name')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="educationalLevel"
                                render={({ field }) => (
                                    <FormItem>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl dir={language === 'ar' ? 'rtl' : 'ltr'}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('Choose the educational level')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup dir={language === 'ar' ? 'rtl' : 'ltr'}>
                                                    <SelectLabel>{t('educationalLevel')}</SelectLabel>
                                                    {educationalLevelData.map((level, idx) => (
                                                        <SelectItem key={idx} value={level}>{t(level)}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="countOfStudents"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('Count of transferred students')}</FormLabel>
                                        <FormControl>
                                            <Input type="number" min={0} placeholder="Count of Students" onChange={({ target: { value } }: any) => setValue('countOfStudents', Number(value))} value={getValues().countOfStudents} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="transferredCategory"
                                render={({ field }) => (
                                    <FormItem>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl dir={language === 'ar' ? 'rtl' : 'ltr'}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('Choose the category of transferees')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup dir={language === 'ar' ? 'rtl' : 'ltr'}>
                                                    <SelectLabel>{t('Category')}</SelectLabel>
                                                    {transferredCategoryData.map((category, idx) => (
                                                        <SelectItem key={idx} value={category}>{t(category)}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-between items-center">
                                <Button type="submit" disabled={!isValid || isSubmitting}>{t('Save')}</Button>
                                <Button variant='destructive' type='button' onClick={() => router.push(`/stations/${stationId}/school/${schoolId}`)}>{t('Cancel')}</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>

        </div>
    );
};

export default CreateTrafficLineForm;
