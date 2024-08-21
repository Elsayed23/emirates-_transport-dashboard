'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import useTranslation from '@/app/hooks/useTranslation';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';

const page = () => {
    const [question, setQuestion] = useState('');
    const [translatedQuestion, setTranslatedQuestion] = useState('');
    const [orderd, setOrderd] = useState('');
    const [appliesTo, setAppliesTo] = useState('trafficLine');
    const [isBasic, setIsBasic] = useState(false);
    const [answers, setAnswers] = useState([{
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
    }]);
    const [questions, setQuestions] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const { data } = await axios.get('/api/questions');
                setQuestions(data);
            } catch (error) {
                console.error('Error fetching questions:', error);
                toast.error(t('Failed to fetch questions'));
            }
        };

        fetchQuestions();
    }, []);


    const handleAddControlMeasure = (answerIndex) => {
        const newAnswers = [...answers];
        newAnswers[answerIndex].controlMeasures.push({ ar: '', en: '' });
        setAnswers(newAnswers);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/questions/${id}`);
            toast.success(t('Question deleted successfully'));
            setQuestions(questions.filter(q => q.id !== id));
        } catch (error) {
            console.error('Error deleting question:', error);
            toast.error(t('Failed to delete question'));
        }
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                question: isBasic ? 'اساسي' : question,
                translatedQuestion: isBasic ? 'BASIC' : translatedQuestion,
                orderd: parseInt(orderd, 10),
                appliesTo,
                answers,
            };
            await axios.patch('/api/questions', payload);
            toast.success(t('Question and answers have been saved successfully'));
            // Reset form
            setQuestion('');
            setTranslatedQuestion('');
            setOrderd('');
            setAppliesTo('trafficLine');
            setIsBasic(false);
            setAnswers([{
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
            }]);
            // Fetch updated questions
            const { data } = await axios.get('/api/questions');
            setQuestions(data);
        } catch (error) {
            console.error('Error creating question and answers:', error);
            toast.error(t('An error occurred while saving the question and answers'));
        }
    };

    const renderQuestions = (questions) => (
        questions.map((question) => (
            <div key={question.id} className="mb-4 border p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                    <div className="block text-sm font-medium">{t('Question')}: {question.question}</div>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(question.id)}>
                        {t('Delete')}
                    </Button>
                </div>
                <div className="block text-sm font-medium mb-2">{t('Translated Question')}: {question.translatedQuestion}</div>
                <div className="block text-sm font-medium mb-2">{t('Order')}: {question.orderd}</div>
                <div className="block text-sm font-medium mb-2">{t('Applies To')}: {question.appliesTo}</div>
                {question.answers.map((answer) => (
                    <div key={answer.id} className="mb-4 border p-4 rounded-lg">
                        <div className="block text-sm font-medium mb-2">{t('Cause of Risk')}: {answer.causeOfRisk}</div>
                        <div className="block text-sm font-medium mb-2">{t('Activity')}: {answer.activity}</div>
                        <div className="block text-sm font-medium mb-2">{t('Type of Activity')}: {answer.typeOfActivity}</div>
                        <div className="block text-sm font-medium mb-2">{t('Hazard Source')}: {answer.hazardSource}</div>
                        <div className="block text-sm font-medium mb-2">{t('Risk')}: {answer.risk}</div>
                        <div className="block text-sm font-medium mb-2">{t('People Exposed to Risk')}: {answer.peopleExposedToRisk}</div>
                        <div className="block text-sm font-medium mb-2">{t('Risk Assessment')}: {answer.riskAssessment}</div>
                        <div className="block text-sm font-medium mb-2">{t('Residual Risks')}: {answer.residualRisks}</div>
                        <div className="block text-sm font-medium mb-2">{t('Expected Injury')}: {answer.expectedInjury}</div>
                        <div className="block text-sm font-medium mb-2">{t('Control Measures')}:</div>
                        {answer.controlMeasures.map((measure, measureIndex) => (
                            <div key={measureIndex} className="flex gap-2 mb-2">
                                <div className="block text-sm font-medium">{t('AR')}: {measure.ar}</div>
                                <div className="block text-sm font-medium">{t('EN')}: {measure.en}</div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        ))
    );

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="w-full p-4 max-w-4xl border bg-white rounded-lg shadow-md">
                <h1 className="text-xl font-semibold mb-4">{t('Create New Question')}</h1>
                <div className="mb-4">
                    <label className="block text-sm font-medium">{t('Question')}</label>
                    <Textarea value={isBasic ? 'اساسي' : question} onChange={(e) => setQuestion(e.target.value)} disabled={isBasic} />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">{t('Translated Question')}</label>
                    <Textarea value={isBasic ? 'BASIC' : translatedQuestion} onChange={(e) => setTranslatedQuestion(e.target.value)} disabled={isBasic} />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">{t('Order')}</label>
                    <Input type="number" value={orderd} onChange={(e) => setOrderd(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">{t('Applies To')}</label>
                    <Select value={appliesTo} onValueChange={setAppliesTo}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={t('Select an option')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>{t('Apply To')}</SelectLabel>
                                <SelectItem value="trafficLine">{t('Traffic Line')}</SelectItem>
                                <SelectItem value="school">{t('School')}</SelectItem>
                                <SelectItem value="built">{t('Built')}</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">{t('Basic Question')}</label>
                    <Checkbox checked={isBasic} onCheckedChange={setIsBasic} />
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
                <Button onClick={handleSubmit} disabled={!isBasic && (!question || !translatedQuestion || !orderd)}>{t('Save')}</Button>
            </div>
            <div className="w-full p-4 max-w-4xl border bg-white rounded-lg shadow-md mt-8">
                <h2 className="text-lg font-semibold mb-2">{t('Traffic Line Questions')}</h2>
                {renderQuestions(questions.filter(q => q.appliesTo === 'trafficLine'))}
                <h2 className="text-lg font-semibold mb-2">{t('School Questions')}</h2>
                {renderQuestions(questions.filter(q => q.appliesTo === 'school'))}
                <h2 className="text-lg font-semibold mb-2">{t('Built Questions')}</h2>
                {renderQuestions(questions.filter(q => q.appliesTo === 'built'))}
            </div>
        </div>
    );
};

export default page;
