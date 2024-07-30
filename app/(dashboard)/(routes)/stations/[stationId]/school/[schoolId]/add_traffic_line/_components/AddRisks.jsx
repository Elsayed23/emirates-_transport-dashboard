'use client';
import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { getSpecificSchoolName, getSpecificStationName } from '@/app/simple_func/getSpecificData'
import useTranslation from '@/app/hooks/useTranslation';
import LanguageContext from '@/app/context/LanguageContext';
import questionsData from '@/app/constants/questionsData';
import DynamicBreadcrumb from '@/app/(dashboard)/_components/DynamicBreadcrumb';
import { useRouter } from 'next/navigation';

const AddRisksForm = ({ trafficLineData, params: { stationId, schoolId } }) => {
    const [questions, setQuestions] = useState(questionsData);
    const [answers, setAnswers] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);

    const { enStationName } = getSpecificStationName(stationId)
    const router = useRouter()
    const { arSchoolName, enSchoolName } = getSpecificSchoolName(stationId, schoolId)
    useEffect(() => {
        const newAnswers = questions.filter(q => q.answer === 'نعم').map(q => q.questionAnswer);
        setAnswers(newAnswers);
    }, [questions]);

    const handleAnswerChange = useCallback((id, answer) => {
        setQuestions(prevQuestions =>
            prevQuestions.map(q =>
                q.questionId === id ? { ...q, answer } : q
            )
        );
    }, []);

    const allTheAnswersFromQuestions = useMemo(() => questions.map(({ answer }) => answer), [questions]);


    const breadcrumbData = useMemo(() => [
        { url: '/stations', title: t('stations') },
        { url: `/stations/${stationId}`, title: t(`stationsData.${enStationName}`) },
        { url: `/stations/${stationId}/school/${schoolId}`, title: language === 'ar' ? arSchoolName : enSchoolName },
        { title: t('Add an itinerary') }
    ], [stationId, schoolId, enStationName, arSchoolName, enSchoolName, t, language])



    const handleSubmit = useCallback(async () => {
        try {
            if (allTheAnswersFromQuestions.includes('غير مجاب عليها')) {
                toast.error(t('You must answer all questions'));
            } else {
                setIsSubmitting(true);
                const { data } = await axios.post('/api/traffic_line', trafficLineData)

                const dataSending = {
                    trafficLineId: data?.id,
                    risks: answers,
                };
                await axios.post('/api/risks', dataSending);

                toast.success(t('The notification has been saved successfully'));
                router.push(`/stations/${stationId}/school/${schoolId}/trafiicLine/${data?.id}`)
            }
        } catch (error) {
            console.log(error);
        }

    }, [allTheAnswersFromQuestions, answers]);

    const questionCard = useMemo(() => (
        questions.map(({ questionId, question, translatedQuestion, answer }, idx) => (
            <div key={questionId} className='flex flex-col items-start gap-3 py-2 border-b'>
                <span className="flex-1">{idx + 1}- {language === 'ar' ? question : translatedQuestion}</span>
                <div className="flex items-center gap-2">
                    <Button size='sm' className={`${answer === 'نعم' && 'bg-green-800 hover:bg-green-700'}`} onClick={() => handleAnswerChange(questionId, 'نعم')}>{t('نعم')}</Button>
                    <Button size='sm' className={`${answer === 'لا' && 'bg-red-800 hover:bg-red-700'}`} onClick={() => handleAnswerChange(questionId, 'لا')}>{t('لا')}</Button>
                    <Button size='sm' onClick={() => handleAnswerChange(questionId, 'لا ينطبق')}>{t('لا ينطبق')}</Button>
                </div>
                {answer !== 'غير مجاب عليها' && <span className={`text-sm font-semibold mt-2 ${answer === 'لا' ? 'text-red-700' : answer === 'نعم' ? 'text-green-700' : 'text-[#111]'}`}>{t('the answer')}: {t(answer)}</span>}
            </div>
        ))
    ), [questions, handleAnswerChange, language, t]);

    return (
        <div className='p-6'>
            <DynamicBreadcrumb routes={breadcrumbData} />
            <div className="min-h-[calc(100vh-148px)] flex flex-col justify-center items-center">
                <div className="w-full p-4 max-w-xl my-12 max-h-[650px] border overflow-y-scroll bg-white rounded-lg shadow-md flex flex-col gap-5">
                    {questionCard}
                    <Button onClick={handleSubmit} disabled={isSubmitting}>{t('Save')}</Button>
                </div>
            </div>
        </div>
    );
};

export default AddRisksForm;