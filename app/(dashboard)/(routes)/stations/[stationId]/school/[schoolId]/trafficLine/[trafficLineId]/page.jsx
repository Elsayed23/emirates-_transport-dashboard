'use client';
import React, { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
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
import { getSpecificStationName, getSpecificSchoolName, getSpecificTrafficLineData } from '@/app/simple_func/getSpecificData';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Loading from '@/app/(dashboard)/_components/Loading';
import axios from 'axios';
import useTranslation from '@/app/hooks/useTranslation';
import LanguageContext from '@/app/context/LanguageContext';
import { exportRisksToExcel } from '@/utils/exportRisksToExcel';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import 'leaflet/dist/leaflet.css';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { useAuth } from '@/app/context/AuthContext'

const MapContainer = dynamic(() => import('react-leaflet').then(module => module.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(module => module.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(module => module.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(module => module.Popup), { ssr: false });

const Page = ({ params: { stationId, schoolId, trafficLineId } }) => {
    const [risks, setRisks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { enStationName } = getSpecificStationName(stationId);
    const router = useRouter();
    const [isShowQuestionsDialogOpen, setIsShowQuestionsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
    const [user, setUser] = useState(null)
    const { arSchoolName, enSchoolName } = getSpecificSchoolName(stationId, schoolId);

    const [trafficLineName, setTrafficLineName] = useState('');
    const [allQuestionAnswers, setAllQuestionAnswers] = useState([]);
    const [location, setLocation] = useState({ latitude: undefined, longitude: undefined });

    useEffect(() => {
        // Apply Leaflet configuration only on the client side
        if (typeof window !== 'undefined') {
            const L = require('leaflet');
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
            });
        }
    }, []);

    const getTrafficLine = async () => {
        try {
            const { name, latitude, longitude, user } = await getSpecificTrafficLineData(trafficLineId);
            setTrafficLineName(name);
            setUser(user)
            setLocation({ latitude, longitude });
        } catch (error) {
            console.log(error);
        }
    };

    const getRisks = async () => {
        try {
            const { data } = await axios.get(`/api/risks?traffic_line_id=${trafficLineId}`);

            const { risks, allQuestionAnswers } = data;
            if (!risks?.length) {
                router.push(`/stations/${stationId}/school/${schoolId}/trafficLine/${trafficLineId}/add`);
            }
            const allRisks = risks.flatMap(risk => risk.questionAnswers);

            setRisks(allRisks);
            setAllQuestionAnswers(allQuestionAnswers);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTrafficLine();
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
            title: trafficLineName
        }
    ];

    const isHaveRisks = risks.length;

    const handleDownload = () => {
        exportRisksToExcel(risks, `${trafficLineName} Risks`);
    };

    const handleDeleteTrafficLine = async () => {
        try {
            axios.delete(`/api/traffic_line?trafficLine_id=${trafficLineId}`);
            toast.success(t('The itinerary has been successfully deleted'));
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteClick = () => {
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        handleDeleteTrafficLine(trafficLineId);
        setIsDeleteDialogOpen(false);
        router.push(`/stations/${stationId}/school/${schoolId}`);
    };

    const splitAndRender = (text) => {
        const parts = text?.split('|');
        return (
            <>
                {parts[0]}<br />{parts[1]}
            </>
        );
    };


    const main = useAuth()

    const handleMapButtonClick = () => {
        setIsMapDialogOpen(true);
    };

    const makeDIR = language === 'ar' ? 'rtl' : 'ltr';

    const access = main?.user?.id === user?.id || main?.user?.role?.name === 'ADMIN'

    if (loading) return <Loading />

    return (

        <div className="p-6 min-h-[calc(100vh-80px)]">
            <div className="flex flex-col gap-9">
                <DynamicBreadcrumb routes={breadcrumbData} />
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        {
                            access
                            &&
                            <Button className='w-fit justify-start' onClick={() => router.push(`/stations/${stationId}/school/${schoolId}/trafficLine/${trafficLineId}/update`)}>{isHaveRisks ? t('Update risks') : t('Add risks')}</Button>
                        }
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
                                    {allQuestionAnswers.map((qa, index) => (
                                        <div key={index} className="flex border-b py-3 gap-2">
                                            <span>{index + 1}- </span>
                                            <div className="flex flex-col gap-2">
                                                <p><strong>{language === 'ar' ? qa.question : qa.translatedQuestion}</strong></p>
                                                <p>{t(qa.answer)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <DialogFooter className='sm:justify-start'>
                                    <Button onClick={() => setIsShowQuestionsDialogOpen(false)}>{t('Close')}</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={isMapDialogOpen} onOpenChange={setIsMapDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant='outline' onClick={handleMapButtonClick}>{t('Show Map')}</Button>
                            </DialogTrigger>
                            <DialogContent dir={makeDIR} className="sm:max-w-[425px] max-h-[520px] overflow-y-scroll">
                                <DialogHeader className='sm:text-center'>
                                    <DialogTitle>{t('Traffic Line Location')}</DialogTitle>
                                </DialogHeader>
                                {location.latitude !== undefined && location.longitude !== undefined && (
                                    <MapContainer center={[location.latitude, location.longitude]} zoom={13} style={{ direction: language === 'ar' ? 'rtl' : 'ltr', height: '400px', width: '100%' }}>
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <Marker position={[location.latitude, location.longitude]}>
                                            <Popup closeOnClick={false} autoClose={false}>
                                                <span>إسم الضابط: {user?.name}</span> <br />
                                                Latitude: {location.latitude}, Longitude: {location.longitude}
                                            </Popup>
                                        </Marker>
                                    </MapContainer>
                                )}
                                <DialogFooter className='sm:justify-start'>
                                    <Button onClick={() => setIsMapDialogOpen(false)}>{t('Close')}</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <hr />
                    {
                        access
                        &&
                        <>
                            <Button variant='destructive' className='self-start' onClick={handleDeleteClick}>{t('Delete itinerary')}</Button>
                            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                <AlertDialogContent>
                                    <AlertDialogHeader className='sm:text-center'>
                                        <AlertDialogTitle>{t('Are you absolutely sure')}</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            {t('This action cannot be undone')}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className='sm:justify-between'>
                                        <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>{t('Cancel')}</AlertDialogCancel>
                                        <AlertDialogAction onClick={confirmDelete}>{t('Delete')}</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    }

                </div>
                <Table dir={makeDIR}>
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
                            <TableHead className='text-center bg-blue-950 text-xs p-1 text-white border border-black max-w-[100px]'>تقييم الخطر <br /> Risk assessment</TableHead>
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
                                                <td className={`${language === 'ar' ? 'border-l' : 'border-r'} border-black p-2 w-1/2 text-center`}>
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
    );
};

export default Page;
