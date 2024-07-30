"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Loading from "../../../_components/Loading";
import useTranslation from "@/app/hooks/useTranslation";
import { DataTableReport } from "../_components/DataTableReport";
import { exportReportsToExcel } from '@/utils/exportReportsToExcel';
import { stationsData } from "@/app/constants";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/AuthContext";

const ReportPage = ({ params: { id } }) => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRootCauseAdded, setIsRootCauseAdded] = useState(false);
    const [isCorrectiveActionAdded, setIsCorrectiveActionAdded] = useState(false);
    const [isInspectionClose, setIsInspectionClose] = useState(false);
    const [isDeleteRequestDone, setIsDeleteRequestDone] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectionInput, setShowRejectionInput] = useState(false);
    const [approveToggle, setApproveToggle] = useState(false)

    const getNumberOfNotesRecorded = (note_classification) => {
        if (!reportData?.inspections) {
            return 0;
        }
        return reportData.inspections.filter(inspection => inspection.noteClassification === note_classification).length;
    };

    const getReport = async () => {
        try {
            const { data } = await axios.get(`/api/reports/${id}`);
            setReportData(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleApprove = async () => {
        try {
            await axios.patch(`/api/approve_report`, { reportId: id, approved: true });
            setApproveToggle(prev => !prev)
        } catch (error) {
            console.log(error);
        }
    };

    const { user } = useAuth()

    const handleReject = async () => {
        if (!showRejectionInput) {
            setShowRejectionInput(true);
            return;
        }

        if (!rejectionReason) {
            alert("Please provide a reason for rejection.");
            return;
        }

        try {
            await axios.patch(`/api/approve_report`, { reportId: id, approved: false, rejectionReason });
            setApproveToggle(prev => !prev)
        } catch (error) {
            console.log(error);
        }
    };

    const { t } = useTranslation();

    useEffect(() => {
        getReport();
    }, [isRootCauseAdded, isCorrectiveActionAdded, isInspectionClose, isDeleteRequestDone, approveToggle]);

    if (loading) return <Loading />;

    const numberOfMain = getNumberOfNotesRecorded('رئيسية');
    const numberOfSecondary = getNumberOfNotesRecorded('ثانوية');

    return (
        <div className="p-6">
            <h1 className="text-center font-medium text-2xl mb-12">{t(reportData.inspectionType.name)}</h1>
            <div className="overflow-x-auto flex flex-col gap-8">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-center border border-gray-300">المحطة <br /> station</th>
                            <th className="py-3 px-6 text-center border border-gray-300">المدرسة <br /> school</th>
                            <th className="py-3 px-6 text-center border border-gray-300">تاريخ التقرير <br /> Date of report</th>
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
                            <th className="py-3 px-6 text-center border border-gray-300">الاسم <br /> Name</th>
                            <th className="py-3 px-6 text-center border border-gray-300">الوظيفة <br /> The job</th>
                            <th className="py-3 px-6 text-center border border-gray-300">عدد الملاحظات المسجلة <br /> Number of notes recorded</th>
                            <th className="py-3 px-6 text-center border border-gray-300">المدينة <br /> City</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        <tr className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-6 text-center border border-gray-300" rowSpan="2">{reportData.user.name}</td>
                            <td className="py-3 px-6 text-center border border-gray-300" rowSpan="2">ضابط سلامة والصحة المهنية والبيئة <br /> Occupational Health and Safety Officer</td>
                            <td className="py-3 px-6 text-center border border-gray-300 space-y-2">
                                <div>الرئيسية: {numberOfMain}</div>
                                <div>الثانوية: {numberOfSecondary}</div>
                            </td>
                            <td className="py-3 px-6 text-center border border-gray-300" rowSpan="2">{reportData.city}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <DataTableReport
                report={reportData}
                setIsRootCauseAdded={setIsRootCauseAdded}
                setIsCorrectiveActionAdded={setIsCorrectiveActionAdded}
                setIsInspectionClose={setIsInspectionClose}
                setIsDeleteRequestDone={setIsDeleteRequestDone}
            />
            {
                user?.role?.name === 'ADMIN'
                &&
                user?.name === 'Humaid'
                &&
                !reportData.approved && (
                    <div className="flex flex-col gap-4 mt-4">
                        <div className="flex gap-4">
                            <Button variant="outline" onClick={handleApprove}>Approve</Button>
                            <Button variant="outline" onClick={handleReject}>{showRejectionInput ? "Submit" : "Reject"}</Button>
                        </div>
                        {showRejectionInput && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Rejection reason"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="border rounded px-2 py-1 mt-2"
                                />
                            </div>
                        )}
                    </div>
                )
            }
        </div>
    );
};

export default ReportPage;
