'use client';
import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import useTranslation from '@/app/hooks/useTranslation';
import LanguageContext from '@/app/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Loading from '@/app/(dashboard)/_components/Loading';

const AddRisksForm = ({ trafficLineData, params: { stationId, schoolId }, files }) => {
    const [questions, setQuestions] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);

    const { user } = useAuth();

    const router = useRouter();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const { data } = await axios.get('/api/questions?applies_to=trafficLine');
                const formattedQuestions = data.map(q => ({
                    ...q,
                    answer: 'غير مجاب عليها' // default answer
                }));
                setQuestions(formattedQuestions);
                console.log(formattedQuestions);
            } catch (error) {
                console.error('Failed to fetch questions:', error);
                toast.error(t('Failed to fetch questions'));
            }
        };
        fetchQuestions();
    }, []);

    const allTheAnswersFromQuestions = useMemo(() => questions.map(({ answer }) => answer), [questions]);

    const handleAnswerChange = useCallback((id, answer) => {
        setQuestions(prevQuestions =>
            prevQuestions.map(q =>
                q.id === id ? { ...q, answer } : q
            )
        );
    }, []);

    const handleSubmit = useCallback(async () => {
        try {
            if (allTheAnswersFromQuestions.includes('غير مجاب عليها')) {
                toast.error(t('You must answer all questions'));
            } else {
                setIsSubmitting(true);
                const formData = new FormData();
                formData.append('name', trafficLineData.name);
                formData.append('schoolId', trafficLineData.schoolId);
                formData.append('stationId', trafficLineData.stationId);
                formData.append('educationalLevel', trafficLineData.educationalLevel);
                formData.append('countOfStudents', trafficLineData.countOfStudents.toString());
                formData.append('transferredCategory', trafficLineData.transferredCategory);
                if (trafficLineData.latitude) formData.append('latitude', trafficLineData.latitude.toString());
                if (trafficLineData.longitude) formData.append('longitude', trafficLineData.longitude.toString());
                formData.append('userId', user?.id);

                files.forEach((file) => {
                    formData.append('image', file.file);
                });

                const { data } = await axios.post('/api/traffic_line', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const questionAnswers = questions.map(q => ({
                    questionId: q.id,
                    response: q.answer
                }));

                await axios.post('/api/risks', {
                    trafficLineId: data.id,
                    questionAnswers
                });

                toast.success(t('The notification has been saved successfully'));
                router.push(`/stations/${stationId}/school/${schoolId}/trafficLine/${data?.id}`);
            }
        } catch (error) {
            console.error('Failed to save data:', error);
            toast.error(t('Failed to save data'));
        }

    }, [allTheAnswersFromQuestions, questions, trafficLineData, files, user, t, router, stationId, schoolId]);

    const questionCard = useMemo(() => (
        questions.map(({ id, question, translatedQuestion, answer }, idx) => (
            <div key={id} className='flex flex-col items-start gap-3 py-2 border-b'>
                <span className="flex-1">{idx + 1}- {language === 'ar' ? question : translatedQuestion}</span>
                <div className="flex items-center gap-2">
                    <Button size='sm' className={`${answer === 'نعم' && 'bg-green-800 hover:bg-green-700'}`} onClick={() => handleAnswerChange(id, 'نعم')}>{t('نعم')}</Button>
                    <Button size='sm' className={`${answer === 'لا' && 'bg-red-800 hover:bg-red-700'}`} onClick={() => handleAnswerChange(id, 'لا')}>{t('لا')}</Button>
                    <Button size='sm' className={`${answer === 'لا ينطبق' && 'bg-slate-400 hover:bg-slate-500'}`} onClick={() => handleAnswerChange(id, 'لا ينطبق')}>{t('لا ينطبق')}</Button>
                </div>
                {answer !== 'غير مجاب عليها' && <span className={`text-sm font-semibold mt-2 ${answer === 'لا' ? 'text-red-700' : answer === 'نعم' ? 'text-green-700' : 'text-[#111]'}`}>{t('the answer')}: {t(answer)}</span>}
            </div>
        ))
    ), [questions, handleAnswerChange, language, t]);

    if (!questions.length) return <Loading />

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
