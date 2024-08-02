'use client';
import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import useTranslation from '@/app/hooks/useTranslation';
import LanguageContext from '@/app/context/LanguageContext';
import questionsData from '@/app/constants/questionsData';
import DynamicBreadcrumb from '@/app/(dashboard)/_components/DynamicBreadcrumb';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

const AddRisksForm = ({ trafficLineData, params: { stationId, schoolId } }) => {
    const [questions, setQuestions] = useState(questionsData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);

    const { user } = useAuth()

    const router = useRouter();

    const allTheAnswersFromQuestions = useMemo(() => questions.map(({ answer }) => answer), [questions]);


    const handleAnswerChange = useCallback((id, answer) => {
        setQuestions(prevQuestions =>
            prevQuestions.map(q =>
                q.questionId === id ? { ...q, answer } : q
            )
        );
    }, []);

    const handleSubmit = useCallback(async () => {
        try {
            if (allTheAnswersFromQuestions.includes('غير مجاب عليها')) {
                toast.error(t('You must answer all questions'));
            } else {
                setIsSubmitting(true);
                const { data } = await axios.post('/api/traffic_line', { ...trafficLineData, userId: user?.id });

                const questionAnswers = questions.map(q => ({
                    questionId: q.questionId,
                    question: q.question,
                    translatedQuestion: q.translatedQuestion,
                    answer: q.answer,
                    causeOfRisk: q.questionAnswer.causeOfRisk,
                    activity: q.questionAnswer.activity,
                    typeOfActivity: q.questionAnswer.typeOfActivity,
                    hazardSource: q.questionAnswer.hazardSource,
                    risk: q.questionAnswer.risk,
                    peopleExposedToRisk: q.questionAnswer.peopleExposedToRisk,
                    riskAssessment: q.questionAnswer.riskAssessment,
                    residualRisks: q.questionAnswer.residualRisks,
                    expectedInjury: q.questionAnswer.expectedInjury,
                    controlMeasures: q.questionAnswer.controlMeasures
                }));

                await axios.post('/api/risks', {
                    trafficLineId: data.id,
                    questionAnswers
                });

                toast.success(t('The notification has been saved successfully'));
                router.push(`/stations/${stationId}/school/${schoolId}/trafficLine/${data?.id}`);
            }
        } catch (error) {
            console.log(error);
        }
    }, [allTheAnswersFromQuestions, questions, trafficLineData, stationId, schoolId, router, t]);

    const questionCard = useMemo(() => (
        questions.map(({ questionId, question, translatedQuestion, answer }, idx) => (
            <div key={questionId} className='flex flex-col items-start gap-3 py-2 border-b'>
                <span className="flex-1">{idx + 1}- {language === 'ar' ? question : translatedQuestion}</span>
                <div className="flex items-center gap-2">
                    <Button size='sm' className={`${answer === 'نعم' && 'bg-green-800 hover:bg-green-700'}`} onClick={() => handleAnswerChange(questionId, 'نعم')}>{t('نعم')}</Button>
                    <Button size='sm' className={`${answer === 'لا' && 'bg-red-800 hover:bg-red-700'}`} onClick={() => handleAnswerChange(questionId, 'لا')}>{t('لا')}</Button>
                    <Button size='sm' className={`${answer === 'لا ينطبق' && 'bg-slate-400 hover:bg-slate-500'}`} onClick={() => handleAnswerChange(questionId, 'لا ينطبق')}>{t('لا ينطبق')}</Button>
                </div>
                {answer !== 'غير مجاب عليها' && <span className={`text-sm font-semibold mt-2 ${answer === 'لا' ? 'text-red-700' : answer === 'نعم' ? 'text-green-700' : 'text-[#111]'}`}>{t('the answer')}: {t(answer)}</span>}
            </div>
        ))
    ), [questions, handleAnswerChange, language]);

    return (

        <div className="min-h-[calc(100vh-148px)] flex flex-col justify-center items-center">
            <div className="w-full p-4 max-w-xl my-12 max-h-[650px] border overflow-y-scroll bg-white rounded-lg shadow-md flex flex-col gap-5">
                {questionCard}
                <Button onClick={handleSubmit} disabled={isSubmitting}>{t('Save')}</Button>
            </div>
        </div>

    );
};

export default AddRisksForm;
