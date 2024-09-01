'use client'
import React, { useContext, useEffect, useState } from 'react'
import Card from './_components/Card'
import DynamicBreadcrumb from '@/app/(dashboard)/_components/DynamicBreadcrumb'
import axios from 'axios'
import Loading from '@/app/(dashboard)/_components/Loading'
import useTranslation from '@/app/hooks/useTranslation'
import LanguageContext from '@/app/context/LanguageContext'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/app/context/AuthContext'
import Link from 'next/link'

const page = ({ params: { stationId } }) => {

    const [stationData, setStationData] = useState(null)
    const [loading, setLoading] = useState(true)

    const getSchools = async () => {
        try {

            const { data } = await axios.get(`/api/station/${stationId}`)
            setStationData(data)
            setLoading(false);

        } catch (error) {
            console.log(error);
        }
    }


    const { user } = useAuth()

    const { t } = useTranslation()


    const breadcrumbData = [
        {
            url: '/stations',
            title: t('stations')
        },
        {
            title: t(`stationsData.${stationData?.translationName}`)
        }
    ]
    const [countOfTrafficLines, setCountOfTrafficLines] = useState(null)
    const [countOfStudents, setCountOfStudents] = useState(null)

    const getStationsAndStudentsCount = async () => {
        try {
            const { data } = await axios.get(`/api/traffic_line/count?stationId=${stationId}`);

            const countOccurrences = (arr) => {
                return arr.reduce((acc, curr) => {
                    acc[curr.schoolId] = (acc[curr.schoolId] || 0) + 1;
                    return acc;
                }, {});
            };

            const countStudentsPerSchool = (arr) => {
                return arr.reduce((acc, curr) => {
                    acc[curr.schoolId] = (acc[curr.schoolId] || 0) + curr.countOfStudents;
                    return acc;
                }, {});
            };

            setCountOfTrafficLines(countOccurrences(data?.count));
            setCountOfStudents(countStudentsPerSchool(data?.count))
        } catch (error) {
            console.log(error);
        }
    };


    const isEmiratesEducationFoundation = stationData?.schools?.filter(({ contract }) => contract === 'مؤسسة الامارات للتعليم').map((school, idx) => (
        <Card
            key={idx}
            idd={idx}
            stationId={stationId}
            countOfStudents={countOfStudents ? countOfStudents[school.id] : 0}
            countOfTrafficLines={countOfTrafficLines ? countOfTrafficLines[school.id] : 0}
            {...school}
        />
    ))

    const isNotEmiratesEducationFoundation = stationData?.schools?.filter(({ contract }) => contract !== 'مؤسسة الامارات للتعليم').map((school, idx) => (
        <Card
            key={idx}
            idd={idx}
            stationId={stationId}
            countOfStudents={countOfStudents ? countOfStudents[school.id] : 0}
            countOfTrafficLines={countOfTrafficLines ? countOfTrafficLines[school.id] : 0}
            {...school}
        />
    ))

    const { language } = useContext(LanguageContext);

    useEffect(() => {
        getStationsAndStudentsCount()
        getSchools()
    }, [])

    if (loading) return <Loading />

    return (
        <div className="p-6 min-h-[calc(100vh-80px)]">
            <div className="flex flex-col gap-9">
                <DynamicBreadcrumb routes={breadcrumbData} />
                {
                    user?.role?.name === 'ADMIN'
                    &&
                    <Link href={`/stations/${stationId}/school/add`}>
                        <Button className='self-start w-fit'>{t('Add school')}</Button>
                    </Link>
                }
                <div className='flex flex-col gap-4'>
                    <h2 className='text-xl font-medium'>{language === 'ar' ? `${t('station')}  ${t(`stationsData.${stationData?.translationName}`)}` : `${t(`stationsData.${stationData?.translationName}`)} ${t('station')}`} : <span className='font-semibold'>{t('Emirates Education Foundation contract')}</span></h2>
                    <div className="grid grid-cols-3 gap-6">
                        {isEmiratesEducationFoundation}
                    </div>
                    <h2 className='text-xl font-semibold'>{t('Other contracts')}</h2>
                    {
                        isNotEmiratesEducationFoundation?.length
                            ?
                            <div className="grid grid-cols-3 gap-6">
                                {isNotEmiratesEducationFoundation}
                            </div>
                            :
                            <h3 className='text-sm font-medium opacity-80'>{t('There are no schools in the other contracts')}</h3>
                    }

                </div>
            </div>
        </div>
    )
}

export default page