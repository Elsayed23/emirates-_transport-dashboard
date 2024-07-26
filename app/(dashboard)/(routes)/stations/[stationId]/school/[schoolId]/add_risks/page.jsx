'use client'
import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import DynamicBreadcrumb from '@/app/(dashboard)/_components/DynamicBreadcrumb'
import { getSpecificStationName, getSpecificTrafficLineName, getSpecificSchoolName } from '@/app/simple_func/getSpecificData'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Loading from '@/app/(dashboard)/_components/Loading'
import { toast } from 'sonner'
import useTranslation from '@/app/hooks/useTranslation'
import LanguageContext from '@/app/context/LanguageContext'
import SchoolRisksData from '@/app/constants/SchoolRisksData.json'

const page = ({ params: { stationId, schoolId } }) => {
    const [questions, setQuestions] = useState(SchoolRisksData)
    const [loading, setLoading] = useState(true)
    const [answers, setAnswers] = useState([])
    const [isFirstTime, setIsFirstTime] = useState(true)

    const { enStationName } = getSpecificStationName(stationId)
    const { t } = useTranslation()
    const { language } = useContext(LanguageContext)
    const { arSchoolName, enSchoolName } = getSpecificSchoolName(stationId, schoolId)

    useEffect(() => {
        const newAnswers = questions.filter(q => q.answer === 'نعم').map(q => q.questionAnswer)
        setAnswers(newAnswers)
    }, [questions])

    const handleAnswerChange = useCallback((id, answer) => {
        setQuestions(prevQuestions =>
            prevQuestions.map(q =>
                q.questionId === id ? { ...q, answer } : q
            )
        )
    }, [])
    console.log(isFirstTime);
    const breadcrumbData = useMemo(() => [
        { url: '/stations', title: t('stations') },
        { url: `/stations/${stationId}`, title: t(`stationsData.${enStationName}`) },
        { url: `/stations/${stationId}/school/${schoolId}`, title: language === 'ar' ? arSchoolName : enSchoolName },
        { title: t('Add risks') }
    ], [stationId, schoolId, enStationName, arSchoolName, enSchoolName, language])

    const router = useRouter()

    const allTheAnswersFromQuestions = useMemo(() => questions.map(({ answer }) => answer), [questions])

    const getRisks = useCallback(async () => {
        const { data } = await axios.get(`/api/school_risks?station_id=${stationId}&school_id=${schoolId}`)
        console.log(data);
        setIsFirstTime(data?.length ? false : true)
        const questionsIds = data?.map(({ questionId }) => questionId)
        setQuestions(prevQuestions =>
            prevQuestions.map(q =>
                questionsIds?.includes(q.questionId) ? { ...q, answer: 'نعم' } : q
            )
        )
    }, [schoolId])

    useEffect(() => {
        getRisks()
    }, [getRisks])


    const handleSubmit = useCallback(async () => {
        try {
            if (allTheAnswersFromQuestions.includes('غير مجاب عليها')) {
                toast.error(t('You must answer all questions'))
            } else {

                if (isFirstTime) {
                    console.log('first');
                    await axios.post('/api/school_risks', {
                        stationId,
                        schoolId,
                        risks: answers,
                    })
                } else {
                    console.log('not first');
                    await axios.patch('/api/school_risks', {
                        stationId,
                        schoolId,
                        risks: answers,
                    })
                }
                toast.success(t('The notification has been saved successfully'))
                router.push(`/stations/${stationId}/school/${schoolId}/risks`)
            }
        } catch (error) {
            console.log(error)
        }
    }, [allTheAnswersFromQuestions, answers, isFirstTime, router, stationId, schoolId])


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
    ), [questions, handleAnswerChange, language])

    return (
        // !loading ?
        <div className='p-6'>
            <DynamicBreadcrumb routes={breadcrumbData} />
            <div className="min-h-[calc(100vh-148px)] flex flex-col justify-center items-center">
                <div className="w-full p-4 max-w-xl max-h-[650px] border overflow-y-scroll bg-white rounded-lg shadow-md flex flex-col gap-5">
                    {questionCard}
                    <Button onClick={handleSubmit}>{t('Save')}</Button>
                </div>
            </div>
        </div>
        // :
        // <Loading />
    )
}

export default page
