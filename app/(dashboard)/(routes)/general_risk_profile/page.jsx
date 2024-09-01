'use client'
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import LanguageContext from '@/app/context/LanguageContext';
import useTranslation from '@/app/hooks/useTranslation';

const Page = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get('/api/risks/all'); // Replace with your actual API endpoint

                setData(data);
            } catch (error) {
                console.error('Error fetching the risks data:', error);
            }
        };

        fetchData();
    }, []);

    const { t } = useTranslation()

    const splitAndRender = (text) => {
        const parts = text?.split('|');
        return (
            <>
                {parts[0]}<br />{parts[1]}
            </>
        );
    };
    const { language } = useContext(LanguageContext);

    return (
        <div className='flex flex-col p-6'>
            <h1 className='font-medium text-center text-3xl'>{t('General Risk Register')}</h1>

            {data.map((categoryData, categoryIdx) => (
                <div key={categoryIdx} className="flex flex-col mt-4">
                    <h1 className="font-medium text-xl mb-2 capitalize">{t(categoryData.header)}</h1>
                    <Table dir={language === 'ar' ? 'rtl' : 'ltr'}>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px] text-center bg-blue-950 text-xs px-0 text-white border border-black">م <br /> NO</TableHead>
                                <TableHead className="w-[100px] text-center bg-blue-950 text-xs px-0 text-white border border-black">سبب الخطر <br /> Cause of risk</TableHead>
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
                            {categoryData.risks.map((risk, riskIdx) => (
                                <TableRow key={riskIdx} className={`${riskIdx % 2 === 0 ? 'bg-blue-400 bg-opacity-50 hover:bg-blue-100' : ''}`}>
                                    <TableCell className="font-medium border border-black text-center break-words text-wrap p-2 text-xs">{riskIdx + 1}</TableCell>
                                    <TableCell className="font-medium border border-black text-center break-words text-wrap p-2 max-w-[100px] text-xs">{splitAndRender(risk.causeOfRisk)}</TableCell>
                                    <TableCell className="text-center break-words text-wrap p-2 text-xs border border-black max-w-[200px]">{splitAndRender(risk.activity)}</TableCell>
                                    <TableCell className='text-center break-words text-wrap p-2 text-xs border border-black max-w-[80px]'>{splitAndRender(risk.typeOfActivity)}</TableCell>
                                    <TableCell className='text-center break-words text-wrap p-2 text-xs border border-black max-w-[200px]'>{splitAndRender(risk.hazardSource)}</TableCell>
                                    <TableCell className='w-44 text-center break-words text-wrap p-2 text-xs border border-black'>{splitAndRender(risk.risk)}</TableCell>
                                    <TableCell className='text-center break-words text-wrap p-2 text-xs border border-black max-w-[130px]'>{splitAndRender(risk.peopleExposedToRisk)}</TableCell>
                                    <TableCell className='text-center break-words text-wrap p-2 text-xs border border-black max-w-[100px]'>{splitAndRender(risk.expectedInjury)}</TableCell>
                                    <TableCell className='text-center break-words text-wrap p-2 text-xs border border-black max-w-[100px]' dir='ltr'>{risk.riskAssessment}</TableCell>
                                    <TableCell className='border text-xs text-center p-0 border-black min-w-[380px]'>
                                        {risk.controlMeasures.map(({ ar, en }, idx) => (
                                            <div className='w-full grid grid-cols-2' key={idx}>
                                                <div className={`${language === 'ar' ? 'border-l' : 'border-r'} border-black p-1 border-y text-center break-words text-wrap`}>
                                                    <h3>{language === 'ar' ? ar : en}</h3>
                                                </div>
                                                <div className='p-1 text-center break-words border-y border-black text-wrap'>
                                                    <h3>{language === 'ar' ? en : ar}</h3>
                                                </div>
                                            </div>
                                        ))}
                                    </TableCell>
                                    <TableCell className='text-center break-words text-wrap text-xs border border-black max-w-[100px]'>{risk.residualRisks}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ))}
            <div className="p-4">
                {/* Main Likelihood vs Severity Table */}
                <table className="w-full border-collapse text-center mt-5">
                    <thead>
                        <tr>
                            <th rowSpan="2" className="border border-black p-2 bg-yellow-900 text-white">الاحتمالية<br />Likelihood</th>
                            <th colSpan="5" className="border border-black p-2 bg-yellow-900 text-white">الشدة<br />Severity</th>
                        </tr>
                        <tr>
                            <th className="border border-black p-2 bg-slate-500 text-white">غير مؤثر<br />(1)</th>
                            <th className="border border-black p-2 bg-slate-500 text-white">بسيط<br />(2)</th>
                            <th className="border border-black p-2 bg-slate-500 text-white">متوسط<br />(3)</th>
                            <th className="border border-black p-2 bg-slate-500 text-white">كبير<br />(4)</th>
                            <th className="border border-black p-2 bg-slate-500 text-white">كارثي<br />(5)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-black p-2 bg-slate-500 text-white">نادر الحدوث<br />Rare (1)</td>
                            <td className="bg-green-500 border border-black p-2">1</td>
                            <td className="bg-green-500 border border-black p-2">2</td>
                            <td className="bg-yellow-500 border border-black p-2">3</td>
                            <td className="bg-yellow-500 border border-black p-2">4</td>
                            <td className="bg-yellow-500 border border-black p-2">5</td>
                        </tr>
                        <tr>
                            <td className="border border-black p-2 bg-slate-500 text-white">ممكن الحدوث<br />Possible (2)</td>
                            <td className="bg-green-500 border border-black p-2">2</td>
                            <td className="bg-yellow-500 border border-black p-2">4</td>
                            <td className="bg-yellow-500 border border-black p-2">6</td>
                            <td className="bg-orange-500 border border-black p-2">8</td>
                            <td className="bg-orange-500 border border-black p-2">10</td>
                        </tr>
                        <tr>
                            <td className="border border-black p-2 bg-slate-500 text-white">محتمل الحدوث<br />Likely (3)</td>
                            <td className="bg-yellow-500 border border-black p-2">3</td>
                            <td className="bg-yellow-500 border border-black p-2">6</td>
                            <td className="bg-orange-500 border border-black p-2">9</td>
                            <td className="bg-red-600 border border-black p-2">12</td>
                            <td className="bg-red-600 border border-black p-2">15</td>
                        </tr>
                        <tr>
                            <td className="border border-black p-2 bg-slate-500 text-white">غالب الحدوث<br />Often (4)</td>
                            <td className="bg-yellow-500 border border-black p-2">4</td>
                            <td className="bg-orange-500 border border-black p-2">8</td>
                            <td className="bg-red-600 border border-black p-2">12</td>
                            <td className="bg-red-600 border border-black p-2">16</td>
                            <td className="bg-red-600 border border-black p-2">20</td>
                        </tr>
                        <tr>
                            <td className="border border-black p-2 bg-slate-500 text-white">متكرر الحدوث<br />Frequent/ Almost Certain (5)</td>
                            <td className="bg-yellow-500 border border-black p-2">5</td>
                            <td className="bg-orange-500 border border-black p-2">10</td>
                            <td className="bg-red-600 border border-black p-2">15</td>
                            <td className="bg-red-600 border border-black p-2">20</td>
                            <td className="bg-red-600 border border-black p-2">25</td>
                        </tr>
                    </tbody>
                </table>

                <table className="w-full border-collapse text-center mt-8">
                    <thead>
                        <tr>
                            <th className="bg-red-600 text-white border border-black p-2">15-25</th>
                            <th className="bg-yellow-500 text-black border border-black p-2">12-8</th>
                            <th className="bg-yellow-300 text-black border border-black p-2">4-6</th>
                            <th className="bg-green-300 text-black border border-black p-2">3-1</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-black p-2 align-top">
                                <strong>خطر شديد<br />Extreme Risk</strong>
                                <ul className="list-disc list-inside text-right mt-2">
                                    <li>تتميز مخاطر RTS بعدم توافق الأفراد والمركبات مع متطلبات الإجراءات التنظيمية والقانونية المتعلقة بالسلامة المرورية.</li>
                                    <li>يجب عدم الاستمرار بتقديم الخدمة حتى يتم تخفيض الخطر إلى المستويات المقبولة.</li>
                                </ul>
                                <ul className="list-disc list-inside text-left mt-2">
                                    <li>RTS risks are characterized by the non-compliance of individuals and vehicles with regulatory and legal requirements related to traffic safety.</li>
                                    <li>Service should not continue until the risk is reduced to acceptable levels.</li>
                                </ul>
                            </td>
                            <td className="border border-black p-2 align-top">
                                <strong>خطر عالي<br />High Risk</strong>
                                <ul className="list-disc list-inside text-right mt-2">
                                    <li>تتميز مخاطر RTS بتوافق الأفراد والمركبات مع متطلبات الإجراءات التنظيمية والقانونية المتعلقة بالسلامة المرورية.</li>
                                    <li>يتم تطوير العمليات للتخلص من المخاطر التي يتم تضمينها في أهداف السلامة المرورية، نظام السلامة، وخطط تحقيقها.</li>
                                </ul>
                                <ul className="list-disc list-inside text-left mt-2">
                                    <li>RTS risks are characterized by the compliance of individuals and vehicles with regulatory and legal requirements related to traffic safety.</li>
                                    <li>Processes are developed to eliminate risks that are included in traffic safety objectives, safety systems, and their implementation plans.</li>
                                </ul>
                            </td>
                            <td className="border border-black p-2 align-top">
                                <strong>خطر متوسط<br />Medium Risk</strong>
                                <ul className="list-disc list-inside text-right mt-2">
                                    <li>يمكن أن تخضع العمليات للإدارة أثناء التشغيل أو التعديل.</li>
                                    <li>الانحرافات المبررة عن متطلبات الإجراءات التنظيمية والقانونية المتعلقة بالسلامة المرورية ممكنة باستخدام وسائل الحماية الهندسية في المركبات أو الحلول الإدارية في تقديم الخدمات.</li>
                                    <li>التواجد المحتمل لظروف تقديم الخدمة القاسية والضارة التي تتم إدارتها وفقًا للتشريعات ذات العلاقة.</li>
                                </ul>
                                <ul className="list-disc list-inside text-left mt-2">
                                    <li>Operations may be managed during operation or modification.</li>
                                    <li>Justified deviations from regulatory and legal requirements related to traffic safety are possible using engineering safeguards in vehicles or administrative solutions in service delivery.</li>
                                    <li>The potential presence of harsh and harmful service delivery conditions managed in accordance with relevant legislation.</li>
                                </ul>
                            </td>
                            <td className="border border-black p-2 align-top">
                                <strong>خطر منخفض<br />Low Risk</strong>
                                <ul className="list-disc list-inside text-right mt-2">
                                    <li>مراقبة الخطر لضمان عدم تصاعده أو تغيير ظروفه.</li>
                                    <li>لا يتطلب أي خطوات إضافية ما لم يكن زيادة مستوى الخطر محتملة.</li>
                                </ul>
                                <ul className="list-disc list-inside text-left mt-2">
                                    <li>Monitor the risk to ensure it does not escalate or change conditions.</li>
                                    <li>No further steps are required unless the risk level is likely to increase.</li>
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Page;
