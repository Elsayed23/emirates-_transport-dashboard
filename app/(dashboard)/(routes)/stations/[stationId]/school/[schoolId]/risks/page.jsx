'use client';
import React, { useContext, useEffect, useState } from 'react';
import DynamicBreadcrumb from '@/app/(dashboard)/_components/DynamicBreadcrumb';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import Loading from '@/app/(dashboard)/_components/Loading';
import axios from 'axios';
import useTranslation from '@/app/hooks/useTranslation';
import LanguageContext from '@/app/context/LanguageContext';
import { exportRisksToExcel } from '@/utils/exportRisksToExcel';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const page = ({ params: { stationId, schoolId } }) => {
    const [risks, setRisks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [allQuestionAnswers, setAllQuestionAnswers] = useState([]);
    const [isShowQuestionsDialogOpen, setIsShowQuestionsDialogOpen] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    const enStationName = searchParams.get('station');
    const arSchoolName = searchParams.get('ar_school');
    const enSchoolName = searchParams.get('en_school');

    const getRisks = async () => {
        try {
            const { data } = await axios.get(`/api/school_risks?school_id=${schoolId}`);
            const { risks, allQuestionAnswers } = data;
            setRisks(risks);
            console.log(data);

            setAllQuestionAnswers(allQuestionAnswers);
            if (!risks?.length) {
                router.push(`/stations/${stationId}/school/${schoolId}/add_risks?station=${enStationName}&ar_school=${arSchoolName}&en_school=${enSchoolName}`);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getRisks();
    }, []);

    const { t } = useTranslation();
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
    ];

    const isHaveRisks = risks.length;

    const handleDownload = () => {
        exportRisksToExcel(risks, `${enSchoolName} Risks`);
    };

    const makeDIR = language === 'ar' ? 'rtl' : 'ltr';

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
                <div className="flex flex-col gap-9">
                    <DynamicBreadcrumb routes={breadcrumbData} />
                    <div className="flex items-center gap-3">
                        <Button className='w-fit justify-start' onClick={() => router.push(`/stations/${stationId}/school/${schoolId}/add_risks`)}>{isHaveRisks ? t('Update risks') : t('Add risks')}</Button>
                        <Button variant='outline' onClick={handleDownload}>{t('Download Risks')}</Button>
                        <Dialog open={isShowQuestionsDialogOpen} onOpenChange={setIsShowQuestionsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">{t('View question answers')}</Button>
                            </DialogTrigger>
                            <DialogContent dir={makeDIR} className="sm:max-w-[425px] max-h-[520px] overflow-y-scroll">
                                <DialogHeader>
                                    <DialogTitle>{t('All Questions and Answers')}</DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col gap-4 py-4">
                                    {allQuestionAnswers.map(({ question: { question, translatedQuestion }, response }, index) => (
                                        <div key={index} className="flex border-b py-3 gap-2">
                                            <span>{index + 1}- </span>
                                            <div className="flex flex-col gap-2">
                                                <p><strong>{language === 'ar' ? question : translatedQuestion}</strong></p>
                                                <p>{t(response)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <DialogFooter className='sm:justify-start'>
                                    <Button onClick={() => setIsShowQuestionsDialogOpen(false)}>{t('Close')}</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Table dir={makeDIR}>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px] text-center bg-blue-950 text-xs px-0 text-white border border-black">م <br /> NO</TableHead>
                                <TableHead className="w-[100px] text-center bg-blue-950 text-xs px-0 text-white border border-black">سبب الخطر <br /> Cause of risk</TableHead>
                                <TableHead className='text-center bg-blue-950 text-xs px-0 text-white border border-black max-w-[150px]'>النشاط <br /> Activity</TableHead>
                                <TableHead className='text-center bg-blue-950 text-xs px-0 text-white border border-black max-w-[80px]'>نوع النشاط <br /> Type of Activity</TableHead>
                                <TableHead className='text-center bg-blue-950 text-xs px-0 text-white border border-black max-w-[200px]'>مصدر الخطر <br /> Hazard</TableHead>
                                <TableHead className='text-center bg-blue-950 text-xs px-0 text-white border border-black max-w-[250px]'>الخطر <br /> Risk</TableHead>
                                <TableHead className='text-center bg-blue-950 text-xs p-1 text-white border border-black max-w-[130px]'>الأشخاص المعرضين للخطر <br /> People Exposed to Risk</TableHead>
                                <TableHead className='text-center bg-blue-950 text-xs p-1 text-white border border-black max-w-[100px]'>الإصابة المحتملة <br /> Expected Injury</TableHead>
                                <TableHead className='text-center bg-blue-950 text-xs p-1 text-white border border-black max-w-[100px]'>تقييم الخطر <br /> Risk assessment</TableHead>
                                <TableHead className='text-center bg-blue-950 text-xs px-0 text-white border border-black min-w-[380px]'>تدابير الرقابة الحالية <br /> Existing Control Measures</TableHead>
                                <TableHead className='text-center bg-blue-950 text-xs p-1 text-white border border-black max-w-[100px]'>المخاطر المتبقية <br /> Residual Risk ALARP</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {risks.map((risk, idx) => {
                                const {
                                    causeOfRisk,
                                    activity,
                                    typeOfActivity,
                                    hazardSource,
                                    risk: riskDescription,
                                    peopleExposedToRisk,
                                    expectedInjury,
                                    riskAssessment,
                                    controlMeasures,
                                    residualRisks
                                } = risk.answers[0];

                                return (
                                    <TableRow key={idx} className={`${idx % 2 === 0 ? 'bg-blue-400 bg-opacity-50 hover:bg-blue-100' : ''}`}>
                                        <TableCell className="font-medium border border-black text-center break-words text-wrap p-2 text-xs">{idx + 1}</TableCell>
                                        <TableCell className="font-medium border border-black text-center break-words text-wrap p-2 max-w-[100px] text-xs">{splitAndRender(causeOfRisk)}</TableCell>
                                        <TableCell className="text-center break-words text-wrap p-2 text-xs border border-black max-w-[200px]">{splitAndRender(activity)}</TableCell>
                                        <TableCell className='text-center break-words text-wrap p-2 text-xs border border-black max-w-[80px]'>{splitAndRender(typeOfActivity)}</TableCell>
                                        <TableCell className='text-center break-words text-wrap p-2 text-xs border border-black max-w-[200px]'>{splitAndRender(hazardSource)}</TableCell>
                                        <TableCell className='w-44 text-center break-words text-wrap p-2 text-xs border border-black'>{splitAndRender(riskDescription)}</TableCell>
                                        <TableCell className='text-center break-words text-wrap p-2 text-xs border border-black max-w-[130px]'>{splitAndRender(peopleExposedToRisk)}</TableCell>
                                        <TableCell className='text-center break-words text-wrap p-2 text-xs border border-black max-w-[100px]'>{splitAndRender(expectedInjury)}</TableCell>
                                        <TableCell className='text-center break-words text-wrap p-2 text-xs border border-black max-w-[100px]'>{riskAssessment}</TableCell>
                                        <TableCell className='border text-xs text-center p-0 border-black min-w-[380px]'>
                                            <div className='w-full grid grid-cols-2'>
                                                {controlMeasures.map(({ ar, en }, idx) => (
                                                    <>
                                                        <div key={idx} className={`${language === 'ar' ? 'border-l' : 'border-r'} border-black p-1 border-y text-center break-words text-wrap`}>
                                                            <h3>{ar}</h3>
                                                        </div>
                                                        <div className='p-1 text-center break-words border-y border-black text-wrap'>
                                                            <h3>{en}</h3>
                                                        </div>
                                                    </>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className='text-center break-words text-wrap text-xs border-b border-black max-w-[100px]'>{residualRisks}</TableCell>
                                    </TableRow>
                                );
                            })}
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
    );
};

export default page;
