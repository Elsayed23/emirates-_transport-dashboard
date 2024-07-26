"use client";
import React, { useEffect, useRef, useState } from 'react';
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
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

const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    idOfBus: z.string().min(1, { message: "Bus ID is required" }),
    noteClassification: z.string().min(1, { message: "Classification is required" }),
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
    const videoRef = useRef<HTMLVideoElement | any>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: 'اي اسم',
            idOfBus: '',
            noteClassification: '',
            description: '',
        }
    });

    const { isSubmitting, isValid } = form.formState;

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

    const notesData = [
        {
            id: 'ثانوية',
            name: 'عدم تثبيت صندوق الإسعافات الأولية',
        },
        {
            id: 'ثانوية',
            name: 'عدم تثبيت سلة المهملات',
        },
        {
            id: 'رئيسية',
            name: 'وجود صدأ علي الهيكل الخارجي للحافلة',
        },
        {
            id: 'رئيسية',
            name: 'تلف في حزام الأمان',
        },
    ];

    const saveInspection = async (inspection: FormSchema) => {
        const selectedNote = notesData.find(note => note.name === inspection.noteClassification);
        const formData = new FormData();
        formData.append('reportId', id);
        formData.append('name', inspection.name);
        formData.append('idOfBus', inspection.idOfBus);
        formData.append('noteClassification', selectedNote?.id || '');
        formData.append('description', selectedNote?.name || '');

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
            form.setValue('noteClassification', '');
            form.setValue('description', 'اي وصف');
            setFiles([]);
            setPhotoCaptured(false);
        } catch (error) {
            console.error('Error saving inspection:', error);
        }
    };

    const finishInspection = async () => {
        if (form.getValues("name") || form.getValues("idOfBus") || form.getValues("noteClassification") || form.getValues("description")) {
            await addInspectionToStateAndSave(form.getValues());
            toast.success('All inspections saved successfully!');
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

    const notes = notesData.map((note, idx) => (
        <SelectItem key={idx} value={note.name}>{note.name}</SelectItem>
    ));

    const thumbs = files.map(({ preview }) => (
        <div key={preview} className="inline-flex border border-gray-200 mb-2 mr-2 w-24 h-24 p-1 box-border">
            <div className="flex min-w-0 overflow-hidden">
                <img
                    src={preview}
                    className="block w-auto h-full"
                    onLoad={() => { URL.revokeObjectURL(preview) }}
                />
            </div>
        </div>
    ));

    return (
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
            <div className='mb-6 border bg-white rounded-md p-6 max-w-lg w-full mx-auto shadow-lg'>
                <h1 className='text-center text-xl font-medium mb-4'>إضافة تفتيش</h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(addInspectionToStateAndSave)} className='space-y-6'>
                        <FormField
                            control={form.control}
                            name="idOfBus"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bus ID</FormLabel>
                                    <FormControl>
                                        <Input
                                            id='idOfBus'
                                            disabled={isSubmitting || busIdSaved}
                                            placeholder="Bus ID..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='flex justify-between items-center gap-2'>
                            {busIdSaved ? (
                                <Button
                                    variant='secondary'
                                    type='button'
                                    onClick={() => setBusIdSaved(false)}
                                >
                                    Edit
                                </Button>
                            ) : (
                                <Button
                                    type='button'
                                    disabled={isSubmitting || !form.getValues("idOfBus")}
                                    onClick={() => setBusIdSaved(true)}
                                >
                                    Save Bus ID
                                </Button>
                            )}
                        </div>

                        {busIdSaved && (
                            <>
                                {capturing ? (
                                    <div className="flex flex-col items-center">
                                        <video ref={videoRef} className="w-full max-w-xs rounded-md mb-4" autoPlay playsInline></video>
                                        <Button onClick={capturePhoto} variant='default' type='button'>Capture Photo</Button>
                                    </div>
                                ) : (
                                    <div className="flex justify-center">
                                        <Button onClick={handleStartCapture} variant='default' type='button'>Open Camera</Button>
                                    </div>
                                )}

                                {photoCaptured && (
                                    <FormField
                                        control={form.control}
                                        name="noteClassification"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl className='mb-5'>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="إخطر المحطة" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {notes}
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
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

                <div className="flex justify-between items-center gap-2 mt-4">
                    <Button onClick={finishInspection} variant='destructive'>Finish</Button>
                </div>

                {inspections.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-xl mb-4">Added Inspections</h2>
                        <ul className="space-y-2">
                            {inspections.map((inspection, index) => (
                                <li key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded-md shadow-sm">
                                    <span>{inspection?.name} - {inspection?.idOfBus} - {inspection?.noteClassification} - {inspection?.description}</span>
                                    <Button onClick={() => deleteInspection(index)} variant='destructive' size='sm'>Delete</Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
    );
};

export default CreateInspectionPage;