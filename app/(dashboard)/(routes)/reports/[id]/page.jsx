"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Loading from "../../../_components/Loading";
import useTranslation from "@/app/hooks/useTranslation";
import { DataTableReport } from "../_components/DataTableReport";
import { exportReportsToExcel } from '@/utils/exportReportsToExcel';
import { stationsData } from "@/app/constants";
import { Button } from "@/components/ui/button";

const ReportPage = ({ params: { id } }) => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);

    const getNumberOfNotesRecorded = (note_classification) => {
        if (!reportData?.inspections) {
            return 0;
        }
        return reportData.inspections.filter(inspection => inspection.noteClassification === note_classification).length;
    }

    const getReport = async () => {
        try {
            const { data } = await axios.get(`/api/reports/${id}`);
            setReportData(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const getArabicNameForStation = stationsData.find(({ id }) => id === reportData?.stationId)?.name;

    const { t } = useTranslation();

    // const handleDownload = async () => {
    //     await exportReportsToExcel(reportData, `نموذج تفتيش على اجراءات السلانة للنقل المدرسي محطة (${getArabicNameForStation})${reportData?.nameOfSchool}`);
    // }

    useEffect(() => {
        getReport();
    }, []);

    if (loading) return <Loading />;

    const numberOfMain = getNumberOfNotesRecorded('رئيسية');
    const numberOfSecondary = getNumberOfNotesRecorded('ثانوية');

    return (
        <div className="p-6">
            <h1 className="text-center font-medium text-2xl mb-12">التفتيش على إجراءات السلامة في حافلات النقل المدرسي</h1>
            {/* <Button variant='outline' onClick={handleDownload}>تحميل التقرير</Button> */}
            <div className="overflow-x-auto flex flex-col gap-8">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-center border border-gray-300">المحطة</th>
                            <th className="py-3 px-6 text-center border border-gray-300">المدرسة</th>
                            <th className="py-3 px-6 text-center border border-gray-300">تاريخ التقرير</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        <tr className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-6 text-center border border-gray-300">{t(`stationsData.${reportData.nameOfStation}`)}</td>
                            <td className="py-3 px-6 text-center border border-gray-300">{reportData?.nameOfSchool}</td>
                            <td className="py-3 px-6 text-center border border-gray-300">{new Date(reportData.createdAt).toLocaleDateString()}</td>
                        </tr>
                    </tbody>
                </table>

                <div className="h-[1px] bg-slate-500 "></div>

                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-center border border-gray-300">الاسم</th>
                            <th className="py-3 px-6 text-center border border-gray-300">الوظيفة</th>
                            <th className="py-3 px-6 text-center border border-gray-300">عدد الملاحظات المسجلة</th>
                            <th className="py-3 px-6 text-center border border-gray-300">المدينة</th>
                            <th className="py-3 px-6 text-center border border-gray-300">موقع التفتيش</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        <tr className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-6 text-center border border-gray-300" rowSpan="2">{reportData.employeeName}</td>
                            <td className="py-3 px-6 text-center border border-gray-300" rowSpan="2">{reportData.jobTitleOfTheEmployee}</td>
                            <td className="py-3 px-6 text-center border border-gray-300 space-y-2">
                                <div>الرئيسية: {numberOfMain}</div>
                                <div>الثانوية: {numberOfSecondary}</div>
                            </td>
                            <td className="py-3 px-6 text-center border border-gray-300" rowSpan="2">{reportData.city}</td>
                            <td className="py-3 px-6 text-center border border-gray-300" rowSpan="2">{reportData.InspectionSite}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <DataTableReport report={reportData} />
        </div>
    );
};

export default ReportPage;