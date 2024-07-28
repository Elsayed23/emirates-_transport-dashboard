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
import questionsData from '@/app/constants/questionsData'

const Page = ({ params: { stationId, schoolId, trafficLineId } }) => {
    const [questions, setQuestions] = useState(questionsData)
    const [loading, setLoading] = useState(true)
    const [answers, setAnswers] = useState([])
    const [isSubmitting, setisSubmitting] = useState(false)
    const [trafficLineName, setTrafficLineName] = useState(null)
    const [isFirstTime, setIsFirstTime] = useState(true)

    const { enStationName } = getSpecificStationName(stationId)
    const { t } = useTranslation()
    const { language } = useContext(LanguageContext)
    const { arSchoolName, enSchoolName } = getSpecificSchoolName(stationId, schoolId)

    const getTrafficLine = useCallback(async () => {
        try {
            const name = await getSpecificTrafficLineName(trafficLineId)
            if (!name) {
                router.push(`/stations/${stationId}/school/${schoolId}`)
                toast.error(t('The itinerary does not exist'))
            } else {
                setTrafficLineName(name)
            }

            setLoading(false)
        } catch (error) {
            console.log(error);
        }
    }, [trafficLineId])

    useEffect(() => {
        getTrafficLine()
    }, [getTrafficLine])

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

    const breadcrumbData = useMemo(() => [
        { url: '/stations', title: t('stations') },
        { url: `/stations/${stationId}`, title: t(`stationsData.${enStationName}`) },
        { url: `/stations/${stationId}/school/${schoolId}`, title: language === 'ar' ? arSchoolName : enSchoolName },
        { url: `/stations/${stationId}/school/${schoolId}/trafiicLine/${trafficLineId}`, title: trafficLineName },
        { title: t('Add an itinerary') }
    ], [stationId, schoolId, trafficLineId, enStationName, arSchoolName, enSchoolName, trafficLineName, t, language])

    const router = useRouter()

    const allTheAnswersFromQuestions = useMemo(() => questions.map(({ answer }) => answer), [questions])

    const getRisks = useCallback(async () => {
        const { data } = await axios.get(`/api/risks?traffic_line_id=${trafficLineId}`)
        setIsFirstTime(data?.length ? false : true)
        const questionsIds = data?.map(({ questionId }) => questionId)
        setQuestions(prevQuestions =>
            prevQuestions.map(q =>
                questionsIds?.includes(q.questionId) ? { ...q, answer: 'نعم' } : q
            )
        )
    }, [trafficLineId])

    useEffect(() => {
        getRisks()
    }, [getRisks])

    const handleSubmit = useCallback(async () => {
        try {
            setisSubmitting(true)
            if (allTheAnswersFromQuestions.includes('غير مجاب عليها')) {
                toast.error(t('You must answer all questions'))
            } else {
                const dataSending = {
                    trafficLineId,
                    risks: answers,
                }
                if (isFirstTime) {
                    await axios.post('/api/risks', dataSending)
                } else {
                    await axios.patch('/api/risks', dataSending)
                }
                toast.success(t('The notification has been saved successfully'))
                router.push(`/stations/${stationId}/school/${schoolId}/trafiicLine/${trafficLineId}`)
            }
        } catch (error) {
            console.log(error)
        }
    }, [allTheAnswersFromQuestions, answers, isFirstTime, router, stationId, schoolId, trafficLineId])


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
        !loading ?
            <div className='p-6'>
                <DynamicBreadcrumb routes={breadcrumbData} />
                <div className="min-h-[calc(100vh-148px)] flex flex-col justify-center items-center">
                    <div className="w-full p-4 max-w-xl max-h-[650px] border overflow-y-scroll bg-white rounded-lg shadow-md flex flex-col gap-5">
                        {questionCard}
                        <Button onClick={handleSubmit} disabled={isSubmitting}>{t('Save')}</Button>
                    </div>
                </div>
            </div> :
            <Loading />
    )
}

export default Page
