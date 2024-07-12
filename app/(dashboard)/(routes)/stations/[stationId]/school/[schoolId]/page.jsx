'use client'
import React, { useContext, useEffect, useState } from 'react'
import getTrafficLinesOfSchool from '@/app/simple_func/getTrafficLinesOfSchool'
import DynamicBreadcrumb from '@/app/(dashboard)/_components/DynamicBreadcrumb'
import Card from './_components/Card'
import { Button } from '@/components/ui/button'
import { FaCirclePlus } from 'react-icons/fa6'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Loading from '@/app/(dashboard)/_components/Loading'
import useTranslation from '@/app/hooks/useTranslation'
import LanguageContext from '@/app/context/LanguageContext'

const page = ({ params: { stationId, schoolId } }) => {

    const { name, translationName, translationStationName } = getTrafficLinesOfSchool(stationId, schoolId)

    const [loading, setLoading] = useState(true)
    const [trafficLines, setTrafficLines] = useState([])

    const [riskAnalysis, setRiskAnalysis] = useState({})

    const { language } = useContext(LanguageContext);



    const { t } = useTranslation()

    const breadcrumbData = [
        {
            url: '/stations',
            title: t('stations')
        },
        {
            url: `/stations/${stationId}`,
            title: t(`stationsData.${translationStationName}`)
        },
        {
            title: language === 'ar' ? name : translationName
        }
    ]

    const analyzeRisks = (trafficLines) => {
        const targetQuestionIds = [1, 2, 5, 6]
        const analysis = {}

        trafficLines.forEach(line => {
            const uniqueQuestionIds = new Set()
            line.risks.forEach(risk => {
                if (targetQuestionIds.includes(risk.questionId)) {
                    uniqueQuestionIds.add(risk.questionId)
                }
            })
            analysis[line.id] = uniqueQuestionIds.size
        })

        setRiskAnalysis(analysis)

    }



    const getTrafficlines = async () => {
        try {
            const { data } = await axios.get(`/api/traffic_line?stationId=${stationId}&schoolId=${schoolId}`)
            console.log(data);
            setTrafficLines(data)
            analyzeRisks(data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getTrafficlines()
    }, [])

    const router = useRouter()

    const trafficLinesCard = trafficLines.map((trafficLine, idx) => (
        <Card
            key={idx}
            count={idx + 1}
            {...trafficLine}
            stationId={stationId}
            schoolId={schoolId}
            color={riskAnalysis ? riskAnalysis[trafficLine?.id] : 0}
        />
    ))


    return (
        !loading
            ?
            <div className="p-6 min-h-[calc(100vh-80px)]">
                <div className="flex flex-col gap-9">
                    <DynamicBreadcrumb routes={breadcrumbData} />
                    <div className='flex flex-col gap-5'>
                        <h2 className='text-xl font-semibold'>{t('results')}: {trafficLines.length}</h2>
                        <Button className='w-fit flex flex-wrap items-center gap-2' onClick={() => router.push(`/stations/${stationId}/school/${schoolId}/add_traffic_line`)}>{t('Add an itinerary')} <FaCirclePlus size={18} /></Button>
                        {
                            trafficLines.length
                                ?
                                <div className="grid xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                                    {trafficLinesCard}
                                </div>
                                :
                                <h3 className='text-red-600'>{t('There are no itineraries')}</h3>
                        }
                    </div>
                </div>
            </div>
            :
            <Loading />
    )
}

export default page
