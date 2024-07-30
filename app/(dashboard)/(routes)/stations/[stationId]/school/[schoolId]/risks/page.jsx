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

    const getRisks = async () => {
        try {
            const { data } = await axios.get(`/api/school_risks?station_id=${stationId}&school_id=${schoolId}`)
            console.log(data);
            if (!data?.length) {
                router.push(`/stations/${stationId}/school/${schoolId}/add_risks`)
            }
            setRisks(data)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
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
            title: t('Risks')
        }
    ]


    const isHaveRisks = risks.length

    const handleDownload = () => {
        exportRisksToExcel(risks, `${enSchoolName} Risks`);
    };

    return (
        !loading
            ?
            <div className="p-6 min-h-[calc(100vh-80px)]">
                <div className="flex flex-col gap-9" >
                    <DynamicBreadcrumb routes={breadcrumbData} />
                    <div className="flex items-center gap-3">
                        <Button className='w-fit justify-start' onClick={() => router.push(`/stations/${stationId}/school/${schoolId}/add_risks`)}>{isHaveRisks ? t('Update risks') : t('Add risks')}</Button>
                        <Button variant='outline' onClick={handleDownload}>{t('Download Risks')}</Button>
                    </div>
                    <Table dir='rtl'>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px] text-center bg-blue-950 text-xs px-0 text-white border border-black">م <br /> NO</TableHead>
                                <TableHead className="w-[100px] text-center bg-blue-950 text-xs px-0 text-white border border-black">سبب الخطر < br /> Cause of risk</TableHead>
                                <TableHead className='text-center bg-blue-950 text-xs px-0 text-white border border-black max-w-[150px]'>النشاط <br /> Activity</TableHead>
                                <TableHead className='text-center bg-blue-950 text-xs px-0 text-white border border-black max-w-[80px]'>نوع النشاط <br /> Type of Activity</TableHead>
                                <TableHead className='text-center bg-blue-950 text-xs px-0 text-white border border-black max-w-[200px]'>مصدر الخطر <br /> Hazard</TableHead>
                                <TableHead className='text-center bg-blue-950 text-xs px-0 text-white border border-black max-w-[250px]'>الخطر <br /> Risk</TableHead>
                                <TableHead className='text-center bg-blue-950 text-xs p-1 text-white border border-black max-w-[130px]'>الأشخاص المعرضين للخطر <br /> People Exposed to Risk</TableHead>
                                <TableHead className='text-center bg-blue-950 text-xs p-1 text-white border border-black max-w-[100px]'>الإصابة المحتملة <br /> Expected Injury</TableHead>
                                <TableHead className='text-center bg-blue-950 text-xs p-1 text-white border border-black max-w-[100px]'>تقييم الخطر <br /> Risk assessment                              </TableHead>
                                <TableHead className='text-center bg-blue-950 text-xs px-0 text-white border border-black min-w-[380px]'>تدابير الرقابة الحالية <br /> Existing Control Measures</TableHead>
                                <TableHead className='text-center bg-blue-950 text-xs p-1 text-white border border-black max-w-[100px]'>المخاطر المتبقية <br /> Residual Risk ALARP</TableHead>
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
                                    <TableCell className="font-medium border border-black text-center text-xs">{`${causeOfRisk?.split('|')[0]}\n${causeOfRisk?.split('|')[1]}`}</TableCell>
                                    <TableCell className="text-center text-xs border border-black max-w-[150px]">{`${activity?.split('|')[0]}\n${activity?.split('|')[1]}`}</TableCell>
                                    <TableCell className='text-center text-xs border border-black max-w-[80px]'>{`${typeOfActivity?.split('|')[0]}\n${typeOfActivity?.split('|')[1]}`}</TableCell>
                                    <TableCell className='text-center text-xs border border-black max-w-[200px]'>{`${hazardSource?.split('|')[0]}\n${hazardSource?.split('|')[1]}`}</TableCell>
                                    <TableCell className='max-w-[250px] text-center text-xs border border-black'>{`${risk?.split('|')[0]}\n${risk?.split('|')[1]}`}</TableCell>
                                    <TableCell className='text-center text-xs border border-black max-w-[130px]'>{`${peopleExposedToRisk?.split('|')[0]}\n${peopleExposedToRisk?.split('|')[1]}`}</TableCell>
                                    <TableCell className='text-center text-xs border border-black max-w-[100px]'>{`${expectedInjury?.split('|')[0]}\n${expectedInjury?.split('|')[1]}`}</TableCell>
                                    <TableCell className='text-center text-xs border border-black max-w-[100px]'>{riskAssessment}</TableCell>
                                    <TableCell className='border text-xs border-black min-w-[380px]'>
                                        <tbody>
                                            {controlMeasures.map(({ measureAr, measureEn }, idx) => (
                                                <tr key={idx}>
                                                    <td className='border-l border-black p-3 w-1/2  text-center'>
                                                        <h3>{measureAr}</h3>
                                                    </td>
                                                    <td className='p-3 w-1/2 text-center'>
                                                        <h3>{measureEn}</h3>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
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