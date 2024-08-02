'use client';
import React, { useState, useContext, useEffect } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSpecificSchoolName } from '@/app/simple_func/getSpecificData';
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
import AddRisksForm from './AddRisks';
import axios from 'axios';
import Loading from '@/app/(dashboard)/_components/Loading';

const formSchema = z.object({
    name: z.string().min(2, { message: "يجب أن يتكون الاسم من حرفين على الأقل" }),
    schoolId: z.string(),
    stationId: z.string(),
    educationalLevel: z.string().min(1, { message: 'الرجاء إختيار الحلقة' }),
    countOfStudents: z.number().int().min(1, { message: 'أقل عدد طلاب هو 1' }),
    transferredCategory: z.string().min(1, { message: 'الرجاء إختيار اللفئة المنقولة' }),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    image: z.any().optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

interface Params {
    stationId: string;
    schoolId: string;
}

interface TrafficLineManagementProps {
    params: Params;
}

const TrafficLineManagement: React.FC<TrafficLineManagementProps> = ({ params: { schoolId, stationId } }) => {
    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);
    const router = useRouter();

    const [schoolData, setSchoolData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const [trafficLineData, setTrafficLineData] = useState<FormSchemaType | null>(null);
    const [location, setLocation] = useState<{ latitude: number | undefined; longitude: number | undefined }>({ latitude: undefined, longitude: undefined });
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);


    const getSchoolData = async () => {
        try {
            const { data } = await axios.get(`/api/school/${schoolId}`)
            setSchoolData(data)
            setLoading(false)

        } catch (error) {
            console.log(error)
        }
    }

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            schoolId: schoolId,
            stationId: stationId,
            educationalLevel: "",
            countOfStudents: 0,
            transferredCategory: "",
            latitude: undefined,
            longitude: undefined,
            image: undefined,
        },
    });

    useEffect(() => {
        getSchoolData()
    }, [])

    const handleButtonClick = () => {
        if (navigator.geolocation) {
            setIsFetchingLocation(true);
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
            }, showError);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    };

    const showError = (error: GeolocationPositionError) => {
        setIsFetchingLocation(false);
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.log("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                console.log("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                console.log("The request to get user location timed out.");
                break;
            default:
                console.log("An unknown error occurred.");
        }
    };

    const handleConfirm = () => {
        const values = form.getValues();
        setTrafficLineData({ ...values, ...location });
    };

    const onSubmit: SubmitHandler<FormSchemaType> = (values) => {
        console.log({ ...values, ...location });

        setTrafficLineData({ ...values, ...location });
    };

    const educationalLevelData = ['First episode', 'Second episode', 'Third episode', 'Kindergarten', 'Multiple episodes (two or more episodes)', 'Several episodes with kindergarten'];
    const transferredCategoryData = ['Males', 'Females', 'Mixed'];

    const breadcrumbData = [
        { url: '/stations', title: t('stations') },
        { url: `/stations/${stationId}`, title: t(`stationsData.${schoolData?.school?.station?.translationName}`) },
        { url: `/stations/${stationId}/school/${schoolId}`, title: language === 'ar' ? schoolData?.school?.name : schoolData?.school?.translationName },
        { title: t('Add an itinerary') },
    ];

    const { setValue, getValues, formState: { isValid, isSubmitting } } = form;


    if (loading) return <Loading />

    return (
        <div className='p-6'>
            <DynamicBreadcrumb routes={breadcrumbData} />
            {!trafficLineData ? (
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
                                                <Input type="number" min={0} placeholder="Count of Students" onChange={({ target: { value } }) => setValue('countOfStudents', Number(value))} value={getValues().countOfStudents} />
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
                                {/* <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('Upload Image')}</FormLabel>
                                            <FormControl>
                                                <Input type="file" accept="image/*" onChange={(e) => setValue('image', e.target.files?.[0])} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /> */}
                                <Button type="button" onClick={handleButtonClick} disabled={isFetchingLocation}>
                                    تأكيد الموقع
                                </Button>
                                <div className="flex justify-between items-center">
                                    <Button type="submit" disabled={!isValid || isSubmitting || !isFetchingLocation}>
                                        {t('Save')}
                                    </Button>
                                    <Button variant='destructive' type='button' onClick={() => router.push(`/stations/${stationId}/school/${schoolId}`)}>
                                        {t('Cancel')}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            ) : (
                <AddRisksForm trafficLineData={trafficLineData} params={{ stationId, schoolId }} />
            )}
        </div>
    );
};

export default TrafficLineManagement;
