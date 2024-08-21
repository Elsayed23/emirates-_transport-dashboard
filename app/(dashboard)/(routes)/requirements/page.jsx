'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import useTranslation from '@/app/hooks/useTranslation';
import Link from 'next/link';

const page = () => {
    const [inspectionTypes, setInspectionTypes] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [requirements, setRequirements] = useState([]);
    const [selectedRequirement, setSelectedRequirement] = useState(null);
    const [newNote, setNewNote] = useState({ ar: '', en: '', noteClassification: 'ثانوية' });
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

    useEffect(() => {
        if (!selectedType) return;

        const fetchRequirements = async () => {
            try {
                const { data } = await axios.get(`/api/requirement/${selectedType}`);
                setRequirements(data);
                setSelectedRequirement(null); // Reset requirement selection
            } catch (error) {
                console.error('Error fetching requirements:', error);
                toast.error(t('Failed to fetch requirements'));
            }
        };

        fetchRequirements();
    }, [selectedType]);

    const handleTypeChange = (value) => {
        setSelectedType(value);
    };

    const handleRequirementChange = (value) => {
        const requirement = requirements.find(req => req.id === value);
        setSelectedRequirement(requirement);
    };

    const handleNoteChange = (field, value) => {
        setNewNote({
            ...newNote,
            [field]: value,
        });
    };

    const handleAddNote = async () => {
        if (!newNote.ar || !newNote.en) {
            toast.error(t('Please fill in both Arabic and English notes'));
            return;
        }

        try {
            const { data } = await axios.post(`/api/requirement/${selectedRequirement.id}/notes`, newNote);
            setSelectedRequirement({
                ...selectedRequirement,
                notes: [...selectedRequirement.notes, data],
            });
            setNewNote({ ar: '', en: '', noteClassification: 'ثانوية' });
            toast.success(t('Note added successfully'));
        } catch (error) {
            console.error('Error adding note:', error);
            toast.error(t('Failed to add note'));
        }
    };

    return (
        <div className="p-6 min-h-[calc(100vh-80px)]">
            <Link href='/requirements/add'>
                <Button>اضافة متطلب</Button>
            </Link>
            <div className="flex flex-col py-8 min-h-[calc(100vh-168px)] items-center justify-center">
                <div className="w-full p-4 max-w-4xl border bg-white rounded-lg shadow-md">
                    <h1 className="text-xl font-semibold mb-4">{t('Select Inspection Type')}</h1>
                    <Select value={selectedType} onValueChange={handleTypeChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('Select an option')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>{t('Inspection Types')}</SelectLabel>
                                {inspectionTypes.map((type) => (
                                    <SelectItem key={type.id} value={type.id}>
                                        {type.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {selectedType && (
                        <>
                            <h2 className="text-lg font-semibold my-4">{t('Select Requirement')}</h2>
                            <Select value={selectedRequirement?.id || ''} onValueChange={handleRequirementChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t('Select a requirement')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>{t('Requirements')}</SelectLabel>
                                        {requirements.map((req) => (
                                            <SelectItem key={req.id} value={req.id}>
                                                {req.requirement}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </>
                    )}

                    {selectedRequirement && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold">{t('Notes')}</h3>
                            {selectedRequirement.notes.length > 0 ? (
                                selectedRequirement.notes.map(note => (
                                    <div key={note.id} className="mb-2 p-2 border rounded-lg">
                                        <p>{t('Note (AR)')}: {note.ar}</p>
                                        <p>{t('Note (EN)')}: {note.en}</p>
                                        <p>{t('Classification')}: {note.noteClassification}</p>
                                    </div>
                                ))
                            ) : (
                                <p>{t('No notes available')}</p>
                            )}
                            <div className="mt-4">
                                <h4 className="text-md font-semibold">{t('Add New Note')}</h4>
                                <Textarea
                                    placeholder={t('Note (AR)')}
                                    value={newNote.ar}
                                    onChange={(e) => handleNoteChange('ar', e.target.value)}
                                    className="mb-2"
                                />
                                <Textarea
                                    placeholder={t('Note (EN)')}
                                    value={newNote.en}
                                    onChange={(e) => handleNoteChange('en', e.target.value)}
                                    className="mb-2"
                                />
                                <Select value={newNote.noteClassification} onValueChange={(value) => handleNoteChange('noteClassification', value)}>
                                    <SelectTrigger className="w-full mb-2">
                                        <SelectValue placeholder={t('Select Classification')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>{t('Classification')}</SelectLabel>
                                            <SelectItem value="ثانوية">{t('Secondary')}</SelectItem>
                                            <SelectItem value="رئيسية">{t('Primary')}</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleAddNote}>{t('Add Note')}</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default page;
