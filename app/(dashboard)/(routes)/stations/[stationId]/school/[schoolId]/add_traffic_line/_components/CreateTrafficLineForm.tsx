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
import AddRisksForm from './AddRisks';
import axios from 'axios';
import { toast } from 'sonner';

const formSchema = z.object({
    name: z.string().min(2, { message: "يجب أن يتكون الاسم من حرفين على الأقل" }),
    schoolId: z.string(),
    stationId: z.string(),
    educationalLevel: z.string().min(1, { message: 'الرجاء إختيار الحلقة' }),
    countOfStudents: z.number().int().min(1, { message: 'أقل عدد طلاب هو 1' }),
    transferredCategory: z.string().min(1, { message: 'الرجاء إختيار اللفئة المنقولة' }),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
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

    const searchParams = useSearchParams();

    const enStationName = searchParams.get('station');
    const arSchoolName = searchParams.get('ar_school');
    const enSchoolName = searchParams.get('en_school');

    const [trafficLineData, setTrafficLineData] = useState<FormSchemaType | null>(null);
    const [location, setLocation] = useState<{ latitude: number | undefined; longitude: number | undefined }>({ latitude: undefined, longitude: undefined });
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);

    // Camera states
    const [files, setFiles] = useState<{ file: File, preview: string }[]>([]);
    const [photoCaptured, setPhotoCaptured] = useState(false);
    const [capturing, setCapturing] = useState(false);
    const videoRef = useRef<HTMLVideoElement | any>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
        },
    });

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
                toast.info("الرجاء السماح بالوصول الي الموقع");
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

    const onSubmit: SubmitHandler<FormSchemaType> = async (values: any) => {
        setTrafficLineData({ ...values, ...location });
    };

    const educationalLevelData = ['First episode', 'Second episode', 'Third episode', 'Kindergarten', 'Multiple episodes (two or more episodes)', 'Several episodes with kindergarten'];
    const transferredCategoryData = ['Males', 'Females', 'Mixed'];

    const breadcrumbData = [
        { url: '/stations', title: t('stations') },
        { url: `/stations/${stationId}`, title: t(`stationsData.${enStationName}`) },
        { url: `/stations/${stationId}/school/${schoolId}`, title: language === 'ar' ? arSchoolName : enSchoolName },
        { title: t('Add an itinerary') },
    ];

    const { setValue, getValues, formState: { isValid, isSubmitting } } = form;

    // Camera functions
    useEffect(() => {
        const startCapture = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                    setCapturing(true);
                }
            } catch (err) {
                toast.info('الرجاء السماح بالوصول للكاميرا');
                setCapturing(false);
            }
        };

        if (capturing) {
            startCapture();
        }
    }, [capturing]);

    const handleStartCapture = () => {
        setCapturing(true);
    };

    const capturePhoto = () => {
        if (canvasRef.current && videoRef.current) {
            const context = canvasRef.current.getContext("2d");
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

                canvasRef.current.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], `photo-${Date.now()}.jpg`, { type: "image/jpeg" });
                        const preview = URL.createObjectURL(file);
                        setFiles([...files, { file, preview }]);
                        setCapturing(false);
                        setPhotoCaptured(true);
                        if (videoRef.current.srcObject) {
                            (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
                            videoRef.current.srcObject = null;
                        }
                    }
                }, "image/jpeg");
            }
        }
    };

    useEffect(() => {
        return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
    }, [files]);

    const thumbs = files.map(({ preview }, idx) => (
        <div key={idx} className="inline-flex border border-gray-200 mb-2 mr-2 w-24 h-24 p-1 box-border">
            <div className="flex min-w-0 overflow-hidden">
                <img src={preview} className="block w-auto h-full" onLoad={() => { URL.revokeObjectURL(preview); }} />
            </div>
        </div>
    ));

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
                                <div className="flex justify-center">
                                    {capturing ? (
                                        <div className="flex flex-col items-center">
                                            <video ref={videoRef} className="w-full max-w-xs rounded-md mb-4" autoPlay playsInline></video>
                                            <Button onClick={capturePhoto} variant="default" type="button">
                                                {t("Capture Photo")}
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button onClick={handleStartCapture} variant="default" type="button">
                                            {t("Open Camera")}
                                        </Button>
                                    )}
                                </div>
                                <aside className="flex flex-wrap mt-4">{thumbs}</aside>
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
                <AddRisksForm trafficLineData={trafficLineData} params={{ stationId, schoolId }} files={files} />
            )}
            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
    );
};

export default TrafficLineManagement;
