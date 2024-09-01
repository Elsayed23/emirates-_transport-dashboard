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
import Link from 'next/link'
import { toast } from 'sonner'
import { useAuth } from '@/app/context/AuthContext'
import { BsQuestionCircle } from 'react-icons/bs'
import HowToUseModal from '@/app/(dashboard)/_components/HowToUseModal'

const page = ({ params: { stationId, schoolId } }) => {

    const [loading, setLoading] = useState(true)
    const [schoolData, setSchoolData] = useState([])
    const [countOfSchoolRIsks, setCountOfSchoolRIsks] = useState(0)
    const [toggleDeleteTrafficLine, setToggleDeleteTrafficLine] = useState(false)

    const [isOpenHowToUse, setIsOpenHowToUse] = useState(false)

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
            title: t(`stationsData.${schoolData?.station?.translationName}`)
        },
        {
            title: language === 'ar' ? schoolData?.name : schoolData?.translationName
        }
    ]

    const getCountOfSchoolRisks = async () => {
        try {
            const { data } = await axios.get(`/api/school_risks/count?school_id=${schoolId}`)

            setCountOfSchoolRIsks(data)
        } catch (error) {
            console.log(error);
        }
    }


    const handleDeleteTrafficLine = async (trafficLineId) => {
        try {

            axios.delete(`/api/traffic_line?trafficLine_id=${trafficLineId}`)
            setToggleDeleteTrafficLine(prev => !prev)
            toast.success(t('The itinerary has been successfully deleted'))

        } catch (error) {
            console.log(error);
        }
    }


    const getTrafficlines = async () => {
        try {
            const { data } = await axios.get(`/api/school/${schoolId}`)
            setSchoolData(data.school)
            console.log(data);
            setRiskAnalysis(data.riskAnalysis)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getTrafficlines()
    }, [toggleDeleteTrafficLine])

    useEffect(() => {
        getCountOfSchoolRisks()
    }, [])

    const router = useRouter()

    const trafficLinesCard = schoolData?.trafficLine?.map((trafficLine, idx) => (
        <Card
            key={idx}
            count={idx + 1}
            {...trafficLine}
            stationId={stationId}
            schoolId={schoolId}
            handleDeleteTrafficLine={handleDeleteTrafficLine}
            color={riskAnalysis.find(r => r.trafficLineId === trafficLine.id)?.yesCount || 0}
        />
    ))

    const search_params = `station=${schoolData?.station?.translationName}&ar_school=${schoolData?.name}&en_school=${schoolData?.translationName}`

    const { user } = useAuth()

    return (
        !loading
            ?
            <div className="p-6 min-h-[calc(100vh-80px)]">
                <div className="flex flex-col gap-9">
                    <div className="flex justify-between">
                        <DynamicBreadcrumb routes={breadcrumbData} />
                        <Button variant='outline' className='w-fit flex flex-wrap items-center gap-2' dir='ltr' onClick={() => setIsOpenHowToUse(true)}>How to use? <BsQuestionCircle size={18} /></Button>
                    </div>
                    <div className='flex flex-col gap-5'>
                        {
                            user?.role?.name === 'ADMIN' || user?.role?.name === 'OPERATIONS_MANAGER'
                                ?
                                countOfSchoolRIsks === 0
                                    ?
                                    <Button variant='outline' className='w-fit flex flex-wrap items-center gap-2' onClick={() => router.push(`/stations/${stationId}/school/${schoolId}/add_risks?${search_params}`)}>{t('Add risks')} <FaCirclePlus size={18} /></Button>
                                    :
                                    null
                                :
                                null

                        }
                        {

                            countOfSchoolRIsks !== 0
                                ?
                                <Button variant='outline' className='self-start'>
                                    <Link href={`/stations/${stationId}/school/${schoolId}/risks?${search_params}`} className='underline'>{t('School hazards')}</Link>
                                </Button>
                                :
                                null

                        }
                        <h2 className='text-xl font-semibold'>{t('results')}: {schoolData?.trafficLine?.length}</h2>
                        <Button className='w-fit flex flex-wrap items-center gap-2' onClick={() => router.push(`/stations/${stationId}/school/${schoolId}/add_traffic_line?${search_params}`)}>{t('Add an itinerary')} <FaCirclePlus size={18} /></Button>
                        {
                            schoolData?.trafficLine?.length
                                ?
                                <div className="grid xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                                    {trafficLinesCard}
                                </div>
                                :
                                <h3 className='text-red-600'>{t('There are no itineraries')}</h3>
                        }
                    </div>
                </div>
                <HowToUseModal isOpen={isOpenHowToUse} onClose={() => setIsOpenHowToUse(false)} vidUrl='https://res.cloudinary.com/drvysuihb/video/upload/v1724367620/Kazam_screencast_00007_vupyp0.mp4' title='إضافة خط سير' />
            </div>
            :
            <Loading />
    )
}

export default page
