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
import { log } from 'console';

const formSchema = z.object({
    name: z.string().min(1, {
        message: "name is required"
    }),
    stationId: z.string().min(1),
    InspectionSite: z.string().min(1),
    city: z.string().min(1),
    nameOfSchool: z.string().min(1),
    jobTitleOfTheEmployee: z.string().min(1),
    employeeName: z.string().min(1),

});

const page = () => {
    const router = useRouter();

    const stations = stationsData.map((station: any, idx: number) => {
        return (
            <SelectItem key={idx} value={station?.id?.toString()}>{station?.name}</SelectItem>
        )
    })


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: 'اي إسم هلا ',
            stationId: '',
            InspectionSite: 'مواقف  الحافلات في المدرسة ',
            nameOfSchool: '',
            city: 'أبوظبي',
            jobTitleOfTheEmployee: 'ضابط سلامة والصحة المهنية والبيئة',
            employeeName: 'عبدالحميد سعيد سليمان',
        }
    });



    const { isSubmitting, isValid } = form.formState;




    const { language } = useContext(LanguageContext);


    const onSubmit = async (values: z.infer<typeof formSchema>) => {

        const nameOfStation: any = stationsData.find(({ id }) => id === Number(values.stationId))?.translationName



        // files.forEach((file) => {
        //     formData.append('images', file);
        // });

        try {
            const { data } = await axios.post('/api/reports', { ...values, nameOfStation: nameOfStation })

            router.push(`/reports/${data?.id}/inspections/create`)

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
            <div className='mb-6 border bg-slate-100 rounded-md p-4 max-w-lg w-full mx-auto'>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                        <Label className='mb-4' htmlFor='stationId'>المحطة</Label>

                        <FormField
                            control={form.control}
                            name="stationId"
                            render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl className='mb-5' dir={language === 'ar' ? 'rtl' : 'ltr'}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="إختر المحطة" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent dir={language === 'ar' ? 'rtl' : 'ltr'}>
                                            {stations}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <Label className='mb-4' htmlFor='nameOfSchool'>إسم المدرسة</Label>
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
                                            placeholder="الإسم...'"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        {/* <Label className='mb-4' htmlFor='city'>الإمارة</Label>
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
                                            placeholder="الإمارة..."
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
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
                            <Button onClick={() => { router.push('/instruments') }} variant='destructive'>Cancel</Button>
                            <Button
                                type='submit'
                                disabled={isSubmitting || !isValid}
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default page;
