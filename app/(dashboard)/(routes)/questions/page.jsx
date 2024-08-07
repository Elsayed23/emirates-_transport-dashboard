'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { toast } from 'sonner';
import useTranslation from '@/app/hooks/useTranslation';

const page = () => {
    const [question, setQuestion] = useState('');
    const [translatedQuestion, setTranslatedQuestion] = useState('');
    const [orderd, setOrderd] = useState('');
    const [answers, setAnswers] = useState([
        {
            causeOfRisk: '',
            activity: '',
            typeOfActivity: '',
            hazardSource: '',
            risk: '',
            peopleExposedToRisk: '',
            riskAssessment: '',
            residualRisks: '',
            expectedInjury: '',
            controlMeasures: [{ ar: '', en: '' }],
        },
    ]);

    const { t } = useTranslation();

    const handleAddAnswer = () => {
        setAnswers([
            ...answers,
            {
                causeOfRisk: '',
                activity: '',
                typeOfActivity: '',
                hazardSource: '',
                risk: '',
                peopleExposedToRisk: '',
                riskAssessment: '',
                residualRisks: '',
                expectedInjury: '',
                controlMeasures: [{ ar: '', en: '' }],
            },
        ]);
    };

    const handleAddControlMeasure = (answerIndex) => {
        const newAnswers = [...answers];
        newAnswers[answerIndex].controlMeasures.push({ ar: '', en: '' });
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        try {
            await axios.patch('/api/questions', {
                question,
                translatedQuestion,
                orderd: parseInt(orderd, 10),
                answers,
            });
            toast.success(t('Question and answers have been saved successfully'));
            // Reset form
            setQuestion('');
            setTranslatedQuestion('');
            setOrderd('');
            setAnswers([
                {
                    causeOfRisk: '',
                    activity: '',
                    typeOfActivity: '',
                    hazardSource: '',
                    risk: '',
                    peopleExposedToRisk: '',
                    riskAssessment: '',
                    residualRisks: '',
                    expectedInjury: '',
                    controlMeasures: [{ ar: '', en: '' }],
                },
            ]);
        } catch (error) {
            console.error('Error creating question and answers:', error);
            toast.error(t('An error occurred while saving the question and answers'));
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="w-full p-4 max-w-2xl border bg-white rounded-lg shadow-md">
                <h1 className="text-xl font-semibold mb-4">{t('Create New Question')}</h1>
                <div className="mb-4">
                    <label className="block text-sm font-medium">{t('Question')}</label>
                    <Textarea value={question} onChange={(e) => setQuestion(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">{t('Translated Question')}</label>
                    <Textarea value={translatedQuestion} onChange={(e) => setTranslatedQuestion(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">{t('Order')}</label>
                    <Input type="number" value={orderd} onChange={(e) => setOrderd(e.target.value)} />
                </div>
                {answers.map((answer, answerIndex) => (
                    <div key={answerIndex} className="mb-4 border p-4 rounded-lg">
                        {['causeOfRisk', 'activity', 'typeOfActivity', 'hazardSource', 'risk', 'peopleExposedToRisk', 'riskAssessment', 'residualRisks', 'expectedInjury'].map((field) => (
                            <div className="mb-2" key={field}>
                                <label className="block text-sm font-medium">{t(field)}</label>
                                <Input
                                    value={answer[field]}
                                    onChange={(e) => {
                                        const newAnswers = [...answers];
                                        newAnswers[answerIndex][field] = e.target.value;
                                        setAnswers(newAnswers);
                                    }}
                                />
                            </div>
                        ))}
                        <div className="mb-4">
                            <label className="block text-sm font-medium">{t('Control Measures')}</label>
                            <div className="flex flex-col gap-2">
                                {answer.controlMeasures.map((measure, measureIndex) => (
                                    <div key={measureIndex} className="flex gap-2">
                                        <Textarea
                                            value={measure.ar}
                                            placeholder={t('Control Measure (AR)')}
                                            onChange={(e) => {
                                                const newAnswers = [...answers];
                                                newAnswers[answerIndex].controlMeasures[measureIndex].ar = e.target.value;
                                                setAnswers(newAnswers);
                                            }}
                                        />
                                        <Textarea
                                            value={measure.en}
                                            placeholder={t('Control Measure (EN)')}
                                            onChange={(e) => {
                                                const newAnswers = [...answers];
                                                newAnswers[answerIndex].controlMeasures[measureIndex].en = e.target.value;
                                                setAnswers(newAnswers);
                                            }}
                                        />
                                    </div>
                                ))}
                                <Button size='sm' onClick={() => handleAddControlMeasure(answerIndex)}>{t('Add Control Measure')}</Button>
                            </div>
                        </div>
                    </div>
                ))}
                <Button size='sm' onClick={handleAddAnswer}>{t('Add Answer')}</Button>
                <Button onClick={handleSubmit} disabled={!question || !translatedQuestion || !orderd}>{t('Save')}</Button>
            </div>
        </div>
    );
};

export default page;
