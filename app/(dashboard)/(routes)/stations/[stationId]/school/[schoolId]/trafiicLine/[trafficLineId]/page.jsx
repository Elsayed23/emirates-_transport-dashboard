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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const page = ({ params: { stationId, schoolId, trafficLineId } }) => {


    const [risks, setRisks] = useState([])
    const [loading, setLoading] = useState(true)
    const { enStationName } = getSpecificStationName(stationId)
    const router = useRouter()
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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

    const handleDeleteTrafficLine = async () => {
        try {

            axios.delete(`/api/traffic_line?trafficLine_id=${trafficLineId}`)
            setToggleDeleteTrafficLine(prev => !prev)
            toast.success(t('The itinerary has been successfully deleted'))

        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteClick = () => {
        setIsDialogOpen(true);
    }


    const confirmDelete = () => {
        handleDeleteTrafficLine(trafficLineId);
        setIsDialogOpen(false);
        router.push(`/stations/${stationId}/school/${schoolId}`)
    }

    const splitAndRender = (text) => {
        const parts = text?.split('|');
        return (
            <>
                {parts[0]}<br />{parts[1]}
            </>
        );
    };

    return (
        !loading
            ?
            <div className="p-6 min-h-[calc(100vh-80px)]">
                <div className="flex flex-col gap-9" >
                    <DynamicBreadcrumb routes={breadcrumbData} />
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <Button className='w-fit justify-start' onClick={() => router.push(`/stations/${stationId}/school/${schoolId}/trafiicLine/${trafficLineId}/add`)}>{isHaveRisks ? t('Update risks') : t('Add risks')}</Button>
                            <Button variant='outline' onClick={handleDownload}>{t('Download Risks')}</Button>
                        </div>
                        <hr />
                        <Button variant='destructive' className='self-start' onClick={handleDeleteClick}>{t('Delete itinerary')}</Button>
                        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <AlertDialogContent>
                                <AlertDialogHeader className='sm:text-center'>
                                    <AlertDialogTitle>{t('Are you absolutely sure')}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {t('This action cannot be undone')}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className='sm:justify-between'>
                                    <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>{t('Cancel')}</AlertDialogCancel>
                                    <AlertDialogAction onClick={confirmDelete}>{t('Delete')}</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    <Table dir='rtl'>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px] text-center bg-blue-950 text-xs px-0 text-white border border-black">م <br /> NO</TableHead>
                                <TableHead className="w-[100px] text-center bg-blue-950 text-xs px-0 text-white border border-black">سبب الخطر < br /> Cause of risk</TableHead>
                                <TableHead className='text-center bg-blue-950 text-xs px-0 text-white border border-black max-w-[200px]'>النشاط <br /> Activity</TableHead>
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
                                    <TableCell className="font-medium border border-black text-center p-2 text-xs">{idx + 1}</TableCell>
                                    <TableCell className="font-medium border border-black text-center p-2 max-w-[100px] text-xs">{splitAndRender(causeOfRisk)}</TableCell>
                                    <TableCell className="text-center p-2 text-xs border border-black max-w-[200px]">{splitAndRender(activity)}</TableCell>
                                    <TableCell className='text-center p-2 text-xs border border-black max-w-[80px]'>{splitAndRender(typeOfActivity)}</TableCell>
                                    <TableCell className='text-center p-2 text-xs border border-black max-w-[200px]'>{splitAndRender(hazardSource)}</TableCell>
                                    <TableCell className='w-44 text-center p-2 text-xs border border-black'>{splitAndRender(risk)}</TableCell>
                                    <TableCell className='text-center p-2 text-xs border border-black max-w-[130px]'>{splitAndRender(peopleExposedToRisk)}</TableCell>
                                    <TableCell className='text-center p-2 text-xs border border-black max-w-[100px]'>{splitAndRender(expectedInjury)}</TableCell>
                                    <TableCell className='text-center p-2 text-xs border border-black max-w-[100px]'>{riskAssessment}</TableCell>
                                    <TableCell className='border text-xs border-black min-w-[380px]'>
                                        <tbody>
                                            {controlMeasures.map(({ measureAr, measureEn }, idx) => (
                                                <tr key={idx}>
                                                    <td className='border-l border-black p-2 w-1/2  text-center'>
                                                        <h3>{measureAr}</h3>
                                                    </td>
                                                    <td className='p-2 w-1/2 text-center'>
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