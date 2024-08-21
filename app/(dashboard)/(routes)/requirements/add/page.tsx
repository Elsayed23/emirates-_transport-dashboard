'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import useTranslation from '@/app/hooks/useTranslation';

const page = () => {
    const [inspectionTypes, setInspectionTypes] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [requirement, setRequirement] = useState('');
    const [notes, setNotes] = useState([{ ar: '', en: '', noteClassification: 'ثانوية' }]);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchInspectionTypes = async () => {
            try {
                const { data } = await axios.get('/api/inspection_types');
                setInspectionTypes(data);
            } catch (error) {
                console.error('Error fetching inspection types:', error);
                toast.error(t('Failed to fetch inspection types'));
            }
        };

        fetchInspectionTypes();
    }, []);

    const handleAddNote = () => {
        setNotes([...notes, { ar: '', en: '', noteClassification: 'ثانوية' }]);
    };

    const handleNoteChange = (index: any, field: any, value: any) => {
        const newNotes = notes.map((note, i) =>
            i === index ? { ...note, [field]: value } : note
        );
        setNotes(newNotes);
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                inspectionTypeId: selectedType,
                requirement,
                notes,
            };
            await axios.post('/api/requirement', payload);
            toast.success(t('Requirement and notes have been saved successfully'));
            // Reset form
            setSelectedType('');
            setRequirement('');
            setNotes([{ ar: '', en: '', noteClassification: 'ثانوية' }]);
        } catch (error) {
            console.error('Error creating requirement and notes:', error);
            toast.error(t('An error occurred while saving the requirement and notes'));
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="w-full p-4 max-w-4xl border bg-white rounded-lg shadow-md">
                <h1 className="text-xl font-semibold mb-4">{t('Create New Requirement')}</h1>
                <div className="mb-4">
                    <label className="block text-sm font-medium">{t('Select Inspection Type')}</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('Select an option')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>{t('Inspection Types')}</SelectLabel>
                                {inspectionTypes.map((type: any) => (
                                    <SelectItem key={type.id} value={type.id}>
                                        {type.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">{t('Requirement')}</label>
                    <Input
                        type="text"
                        value={requirement}
                        onChange={(e) => setRequirement(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <h3 className="block text-sm font-medium">{t('Notes')}</h3>
                    {notes.map((note, index) => (
                        <div key={index} className="mb-2">
                            <Textarea
                                placeholder={t('Note (AR)')}
                                value={note.ar}
                                onChange={(e) => handleNoteChange(index, 'ar', e.target.value)}
                            />
                            <Textarea
                                placeholder={t('Note (EN)')}
                                value={note.en}
                                onChange={(e) => handleNoteChange(index, 'en', e.target.value)}
                            />
                            <Select
                                value={note.noteClassification}
                                onValueChange={(value) => handleNoteChange(index, 'noteClassification', value)}
                            >
                                <SelectTrigger className="w-full mt-2">
                                    <SelectValue placeholder={t('Select Classification')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>{t('Note Classification')}</SelectLabel>
                                        <SelectItem value="ثانوية">{t('Secondary')}</SelectItem>
                                        <SelectItem value="رئيسية">{t('Primary')}</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    ))}
                    <Button size="sm" onClick={handleAddNote}>
                        {t('Add Another Note')}
                    </Button>
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={!requirement || !selectedType || notes.some(note => !note.ar || !note.en)}
                >
                    {t('Save Requirement')}
                </Button>
            </div>
        </div>
    );
};

export default page;
