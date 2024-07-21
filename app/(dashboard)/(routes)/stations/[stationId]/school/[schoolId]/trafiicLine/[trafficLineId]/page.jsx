'use client'
import React, { useContext, useEffect, useState } from 'react'
import DynamicBreadcrumb from '@/app/(dashboard)/_components/DynamicBreadcrumb'
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getSpecificStationName, getSpecificSchoolName, getSpecificTrafficLineName } from '@/app/simple_func/getSpecificData'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Loading from '@/app/(dashboard)/_components/Loading'
import axios from 'axios'
import useTranslation from '@/app/hooks/useTranslation'
import LanguageContext from '@/app/context/LanguageContext'
import { exportRisksToExcel } from '@/utils/exportRisksToExcel'

const page = ({ params: { stationId, schoolId, trafficLineId } }) => {


    const [risks, setRisks] = useState([])
    const [loading, setLoading] = useState(true)
    const { enStationName } = getSpecificStationName(stationId)
    const router = useRouter()

    const { arSchoolName, enSchoolName } = getSpecificSchoolName(stationId, schoolId)

    const [trafficLineName, setTrafficLineName] = useState('')

    const getTrafficLine = async () => {
        const name = await getSpecificTrafficLineName(trafficLineId)
        setTrafficLineName(name)
    }

    const getRisks = async () => {
        try {
            const { data } = await axios.get(`/api/risks?traffic_line_id=${trafficLineId}`)
            console.log(data);
            if (!data?.length) {
                router.push(`/stations/${stationId}/school/${schoolId}/trafiicLine/${trafficLineId}/add`)
            }
            setRisks(data)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getTrafficLine()
        getRisks()
    }, [])

    const { t } = useTranslation()

    const { language } = useContext(LanguageContext);

    const breadcrumbData = [
        {
            url: '/stations',
            title: t('stations')
        },
        {
            url: `/stations/${stationId}`,
            title: t(`stationsData.${enStationName}`)
        },
        {
            url: `/stations/${stationId}/school/${schoolId}`,
            title: language === 'ar' ? arSchoolName : enSchoolName
        },
        {
            title: trafficLineName
        }
    ]


    const isHaveRisks = risks.length

    const handleDownload = () => {
        exportRisksToExcel(risks, `${trafficLineName} Risks`);
    };

    return (
        !loading
            ?
            <div className="p-6 min-h-[calc(100vh-80px)]">
                <div className="flex flex-col gap-9" >
                    <DynamicBreadcrumb routes={breadcrumbData} />
                    <div className="flex items-center gap-3">
                        <Button className='w-fit justify-start' onClick={() => router.push(`/stations/${stationId}/school/${schoolId}/trafiicLine/${trafficLineId}/add`)}>{isHaveRisks ? t('Update risks') : t('Add risks')}</Button>
                        <Button variant='outline' onClick={handleDownload}>{t('Download Risks')}</Button>
                    </div>
                    <Table dir='rtl'>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px] text-center bg-blue-950 px-0 text-white border border-black">م</TableHead>
                                <TableHead className="w-[100px] text-center bg-blue-950 px-0 text-white border border-black">سبب الخطر</TableHead>
                                <TableHead className='text-center bg-blue-950 px-0 text-white border border-black max-w-[150px]'>النشاط</TableHead>
                                <TableHead className='text-center bg-blue-950 px-0 text-white border border-black max-w-[80px]'>نوع النشاط</TableHead>
                                <TableHead className='text-center bg-blue-950 px-0 text-white border border-black max-w-[200px]'>مصدر الخطر</TableHead>
                                <TableHead className='text-center bg-blue-950 px-0 text-white border border-black max-w-[250px]'>الخطر</TableHead>
                                <TableHead className='text-center bg-blue-950 px-0 text-white border border-black max-w-[130px]'>الأشخاص المعرضين للخطر</TableHead>
                                <TableHead className='text-center bg-blue-950 px-0 text-white border border-black max-w-[100px]'>الإصابة المحتملة</TableHead>
                                <TableHead className='text-center bg-blue-950 px-0 text-white border border-black max-w-[100px]'>تقييم الخطر</TableHead>
                                <TableHead className='text-center bg-blue-950 px-0 text-white border border-black min-w-[380px]'>تدابير الرقابة الحالية</TableHead>
                                <TableHead className='text-center bg-blue-950 px-0 text-white border border-black max-w-[100px]'>المخاطر المتبقية</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {risks.map(({
                                causeOfRisk,
                                activity,
                                typeOfActivity,
                                hazardSource,
                                risk,
                                peopleExposedToRisk,
                                expectedInjury,
                                riskAssessment,
                                controlMeasures,
                                residualRisks,


                            }, idx) => (
                                <TableRow key={idx} className={`${idx % 2 === 0 ? 'bg-blue-400 bg-opacity-50 hover:bg-blue-100' : ''} `}>
                                    <TableCell className="font-medium border border-black text-center text-xs">{idx + 1}</TableCell>
                                    <TableCell className="font-medium border border-black text-center text-xs">{causeOfRisk}</TableCell>
                                    <TableCell className="text-center text-xs border border-black max-w-[150px]">{activity}</TableCell>
                                    <TableCell className='text-center text-xs border border-black max-w-[80px]'>{typeOfActivity}</TableCell>
                                    <TableCell className='text-center text-xs border border-black max-w-[200px]'>{hazardSource}</TableCell>
                                    <TableCell className='max-w-[250px] text-center text-xs border border-black'>{risk}</TableCell>
                                    <TableCell className='text-center text-xs border border-black max-w-[130px]'>{peopleExposedToRisk}</TableCell>
                                    <TableCell className='text-center text-xs border border-black max-w-[100px]'>{expectedInjury}</TableCell>
                                    <TableCell className='text-center text-xs border border-black max-w-[100px]'>{riskAssessment}</TableCell>
                                    <TableCell className='border border-black min-w-[380px]'>
                                        <ul className='list-disc pr-4'>
                                            {controlMeasures.map(({ measure }, idx) => (
                                                <li key={idx} className='mb-3'>{measure}</li>
                                            ))}
                                        </ul>
                                    </TableCell>
                                    <TableCell className='text-center text-xs border border-black max-w-[100px]'>{residualRisks}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={8}>النتائج</TableCell>
                                <TableCell>{risks.length}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>

                </div>
            </div>
            :
            <Loading />
    )
}

export default page