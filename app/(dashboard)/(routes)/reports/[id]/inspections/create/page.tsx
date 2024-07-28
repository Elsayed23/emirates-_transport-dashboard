"use client";
import React, { useContext, useEffect, useRef, useState } from 'react';
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
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { FaCheck } from 'react-icons/fa6';
import { FaEdit } from 'react-icons/fa';
import LanguageContext from '@/app/context/LanguageContext';
import busInspectionNotes from '@/app/constants/busInspectionNotes.json';
import ESInotes from '@/app/constants/electronicSurveillanceInspectionNotes.json';
import useTranslation from '@/app/hooks/useTranslation';

const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    idOfBus: z.string().min(1, { message: "Bus ID is required" }),
    requirement: z.string().optional(),
    description: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

interface PreviewFile {
    file: File;
    preview: string;
}

const CreateInspectionPage = ({ params: { id } }: { params: { id: string } }) => {
    const router = useRouter();
    const [files, setFiles] = useState<PreviewFile[]>([]);
    const [inspections, setInspections] = useState<FormSchema[]>([]);
    const [busIdSaved, setBusIdSaved] = useState(false);
    const [photoCaptured, setPhotoCaptured] = useState(false);
    const [capturing, setCapturing] = useState(false);
    const [isFinishSubmitting, setIsFinishSubmitting] = useState(false)
    const [selectedRequirement, setSelectedRequirement] = useState<string>('');
    const videoRef = useRef<HTMLVideoElement | any>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: 'اي اسم',
            idOfBus: '',
            requirement: '',
            description: 'اي وصف',
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const searchParams = useSearchParams();

    const inspection_type_id = searchParams.get('inspection_type_id');

    const noteData = inspection_type_id === '5f43feba-0e19-4925-8d26-a3bd263cfee3'
        ? ESInotes : inspection_type_id === 'a6f1e99c-a4ab-4df3-b333-ec2d2d04f7b7'
            ? busInspectionNotes : busInspectionNotes;

    useEffect(() => {
        const startCapture = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                    setCapturing(true);
                    console.log("Camera access granted and video feed started.");
                }
            } catch (err) {
                console.error('Error accessing camera:', err);
                toast.error('Failed to access the camera. Please allow camera access.');
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
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

                canvasRef.current.toBlob(blob => {
                    if (blob) {
                        const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
                        const preview = URL.createObjectURL(file);
                        setFiles([{ file, preview }]);
                        setCapturing(false);
                        setPhotoCaptured(true);
                        if (videoRef.current.srcObject) {
                            (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
                            videoRef.current.srcObject = null;
                            console.log("Photo captured and camera stopped.");
                        }
                    }
                }, 'image/jpeg');
            }
        }
    };

    useEffect(() => {
        return () => files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    const saveInspection = async (inspection: FormSchema) => {
        const selectedNote = noteData.flatMap(d => d.notes).find(note => note.ar === inspection.requirement);
        const formData = new FormData();
        formData.append('reportId', id);
        formData.append('name', inspection.name);
        formData.append('idOfBus', inspection.idOfBus);
        formData.append('description', selectedNote?.ar || '');
        formData.append('enDescription', selectedNote?.en || '');
        formData.append('requirement', selectedRequirement);

        files.forEach(({ file }) => {
            formData.append('files', file);
        });

        try {
            const { data } = await axios.post('/api/inspections', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return data;
        } catch (error) {
            console.error('Error saving inspection:', error);
            toast.error('Failed to save inspection.');
            throw error;
        }
    };

    const addInspectionToStateAndSave = async (values: FormSchema) => {
        try {
            const savedInspection = await saveInspection(values);
            setInspections(prevInspections => [...prevInspections, savedInspection.inspection]);
            form.setValue('requirement', '');
            form.setValue('description', 'اي وصف');
            setFiles([]);
            setPhotoCaptured(false);
        } catch (error) {
            console.error('Error saving inspection:', error);
        }
    };

    const finishInspection = async () => {
        if (!form.getValues("name") || !form.getValues("idOfBus") || !form.getValues("requirement") || !form.getValues("description") || !files) {
            toast.error(t('You have to complete the current inspection'));
        } else {
            await addInspectionToStateAndSave(form.getValues());
            setIsFinishSubmitting(true)
            toast.success(t('All inspections saved successfully'));
            router.push(`/reports/${id}`);
        }
    };

    const cancelInspection = () => {
        form.reset();
        setFiles([]);
        setBusIdSaved(false);
        setPhotoCaptured(false);
    };

    const deleteInspection = (index: number) => {
        setInspections(inspections.filter((_, i) => i !== index));
    };

    const handleRequirementChange = (value: string) => {
        setSelectedRequirement(value)
        form.setValue('requirement', '');  // Reset the noteClassification when requirement changes
    };

    const { t } = useTranslation()

    const handleClassificationChange = (value: string) => {
        form.setValue('requirement', value);  // Set the noteClassification based on the selected note
    };

    const availableNotes = noteData.find(data => data.requirement === selectedRequirement)?.notes || [];

    const thumbs = files.map(({ preview }, idx) => (
        <div key={idx} className="inline-flex border border-gray-200 mb-2 mr-2 w-24 h-24 p-1 box-border">
            <div className="flex min-w-0 overflow-hidden">
                <img
                    src={preview}
                    className="block w-auto h-full"
                    onLoad={() => { URL.revokeObjectURL(preview) }}
                />
            </div>
        </div>
    ));

    const { language } = useContext(LanguageContext);

    const makeDIR = language === 'ar' ? 'rtl' : 'ltr'

    return (
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
            <div className='mb-6 border bg-white rounded-md p-6 max-w-lg w-full mx-auto shadow-lg'>
                <h1 className='text-center text-xl font-medium mb-4'>{t('Add inspection')}</h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(addInspectionToStateAndSave)} className='space-y-7'>
                        <div className='space-y-2'>
                            <Label htmlFor='idOfBus'>{t('Bus ID')}</Label>
                            <div className='flex items-center gap-4'>
                                <FormField
                                    control={form.control}
                                    name="idOfBus"
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormControl>
                                                <Input
                                                    id='idOfBus'
                                                    disabled={isSubmitting || busIdSaved}
                                                    placeholder="BOO..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {busIdSaved ? (
                                    <Button
                                        type='button'
                                        size='icon'
                                        onClick={() => setBusIdSaved(false)}
                                    >
                                        <FaEdit size={18} />
                                    </Button>
                                ) : (
                                    <Button
                                        type='button'
                                        size='icon'
                                        disabled={isSubmitting || !form.getValues("idOfBus")}
                                        onClick={() => setBusIdSaved(true)}
                                    >
                                        <FaCheck size={18} />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {busIdSaved && (
                            <>
                                {
                                    inspection_type_id === '5f43feba-0e19-4925-8d26-a3bd263cfee3'
                                        ?
                                        <div className="mb-4">
                                            <Label htmlFor='imageUpload'>Upload Image</Label>
                                            <Input
                                                id='imageUpload'
                                                type='file'
                                                accept="image/*"
                                                onChange={event => {
                                                    if (event.target.files?.[0]) {
                                                        const file = event.target.files[0];
                                                        const preview = URL.createObjectURL(file);
                                                        setFiles([{ file, preview }]);
                                                        setPhotoCaptured(true);
                                                    }
                                                }}
                                            />
                                        </div>
                                        :
                                        capturing ? (
                                            <div className="flex flex-col items-center">
                                                <video ref={videoRef} className="w-full max-w-xs rounded-md mb-4" autoPlay playsInline></video>
                                                <Button onClick={capturePhoto} variant='default' type='button'>{t('Capture Photo')}</Button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-center">
                                                <Button onClick={handleStartCapture} variant='default' type='button'>{t('Open Camera')}</Button>
                                            </div>
                                        )
                                }

                                {photoCaptured && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="requirement"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('Requirement')}</FormLabel>
                                                    <Select
                                                        dir={makeDIR}
                                                        onValueChange={handleRequirementChange}
                                                        defaultValue={selectedRequirement}
                                                    >
                                                        <FormControl className='mb-5'>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder={t('Select the requirement')} />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {noteData.map((data, idx) => (
                                                                <SelectItem key={data.requirement + idx} value={data.requirement}>
                                                                    {
                                                                        language === 'ar'
                                                                            ?
                                                                            data.requirement.split('|')[0]
                                                                            :
                                                                            data.requirement.split('|')[1]
                                                                    }
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
                                            )}
                                        />
                                        {selectedRequirement && (
                                            <FormField
                                                control={form.control}
                                                name="requirement"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t('Note')}</FormLabel>
                                                        <Select
                                                            dir={makeDIR}
                                                            onValueChange={handleClassificationChange}
                                                            defaultValue={field.value}
                                                        >
                                                            <FormControl className='mb-5'>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder={t('Select the note')} />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {availableNotes.map((note, index) => (
                                                                    <SelectItem key={note.ar + index} value={note.ar}>
                                                                        {language === 'ar' ? note.ar : note.en}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                        )}
                                    </>
                                )}
                            </>
                        )}

                        <aside className="flex flex-wrap mt-4">
                            {thumbs}
                        </aside>

                        <div className='flex justify-between items-center gap-2'>
                            <Button
                                type='submit'
                                disabled={isSubmitting || !isValid || !busIdSaved || !photoCaptured}
                            >
                                Add Another Inspection
                            </Button>
                            {inspections.length > 0 && (
                                <Button onClick={cancelInspection} variant='secondary' type='button'>Cancel</Button>
                            )}
                        </div>
                    </form>
                </Form>


                {inspections.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-xl mb-4">Added Inspections</h2>
                        <ul className="space-y-2">
                            {inspections.map((inspection, index) => (
                                <li key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded-md shadow-sm">
                                    <span>{inspection?.name} - {inspection?.idOfBus} - {inspection?.requirement} - {inspection?.description}</span>
                                    <Button onClick={() => deleteInspection(index)} variant='destructive' size='sm'>Delete</Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="flex justify-end items-center gap-2 mt-4">
                    <Button onClick={finishInspection} disabled={isFinishSubmitting} variant='destructive'>Finish</Button>
                </div>

            </div>
            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
    );
};

export default CreateInspectionPage;
