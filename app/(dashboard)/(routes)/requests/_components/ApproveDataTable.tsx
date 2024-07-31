'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import RejectModal from './RejectModal';
import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Loading from '@/app/(dashboard)/_components/Loading';
import { FaSpinner } from 'react-icons/fa';

type Report = {
    id: string;
    nameOfStation: string;
    nameOfSchool: string;
    createdAt: string;
    user: {
        name: string;
    };
};

const ApproveDataTable = ({ setToggleRejectedReport }: any) => {
    const [reports, setReports] = useState<Report[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentReportId, setCurrentReportId] = useState<string | null>(null);
    const [disabledButtons, setDisabledButtons] = useState<{ [key: string]: boolean }>({});
    const [loadingButtons, setLoadingButtons] = useState<{ [key: string]: boolean }>({});
    const [loading, setLoading] = useState(true)

    const getReports = async () => {
        try {
            const { data } = await axios.get('/api/approve_report');
            setReports(data);
            setLoading(false)
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    }

    useEffect(() => {
        getReports();
    }, []);

    const handleAction = async (reportId: string, action: string, reason: string = '') => {
        try {
            setDisabledButtons(prev => ({ ...prev, [reportId]: true }));
            setLoadingButtons(prev => ({ ...prev, [reportId]: action === 'APPROVE' }));

            const data: { reportId: string; approved: boolean; rejectionReason?: string } = { reportId, approved: action === 'APPROVE' };
            if (action === 'REJECT') {
                data.rejectionReason = reason;
            }

            await axios.patch('/api/approve_report', data);
            setReports(reports.filter(report => report.id !== reportId));
            if (action === 'APPROVE') {
                toast.success('تم اعتماد التقرير');
            } else {
                toast.success('تم رفض التقرير');
                setToggleRejectedReport((prev: boolean) => !prev);
            }

        } catch (error) {
            console.error(`Error ${action.toLowerCase()}ing report:`, error);
            toast.error(`Failed to ${action.toLowerCase()} report`);
            setDisabledButtons(prev => ({ ...prev, [reportId]: false }));
        } finally {
            setLoadingButtons(prev => ({ ...prev, [reportId]: false }));
        }
    };


    const handleReject = (reportId: string) => {
        setCurrentReportId(reportId);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (reason: string) => {
        if (currentReportId) {
            await handleAction(currentReportId, 'REJECT', reason);
        }
    };

    const columns: ColumnDef<Report>[] = [
        {
            accessorKey: 'nameOfStation',
            header: () => <div className="text-right">المحطة</div>,
            cell: info => info.getValue(),
        },
        {
            accessorKey: 'nameOfSchool',
            header: () => <div className="text-right">المدرسة</div>,
            cell: info => info.getValue(),
        },
        {
            accessorKey: 'user',
            header: () => <div className="text-right">اسم الضابط</div>,
            cell: ({ row }) => {
                const user = row.getValue('user') as { name: string }
                return (
                    user.name
                )
            },
        },
        {
            accessorKey: 'id',
            header: () => <div className="text-right">التقرير</div>,
            cell: info => (
                <a
                    href={`/reports/${info.getValue<string>()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                >
                    رؤية التقرير
                </a>
            ),
        },
        {
            id: 'actions',
            header: () => <div className="text-right">الإجراءات</div>,
            cell: ({ row }) => {
                const report = row.original;
                return (
                    <div className="flex items-center justify-start gap-3">
                        <Button
                            onClick={() => handleAction(report.id, 'APPROVE')}
                            variant='outline'
                            disabled={!!disabledButtons[report.id]}
                        >
                            {loadingButtons[report.id] ? <FaSpinner size={18} className='animate-spin' /> : 'إعتماد'}
                        </Button>
                        <Button
                            onClick={() => handleReject(report.id)}
                            variant='destructive'
                            disabled={!!disabledButtons[report.id]}
                        >
                            رفض
                        </Button>
                    </div>
                );
            },
        },
        {
            accessorKey: 'createdAt',
            header: () => <div className="text-right">تاريخ التقرير</div>,
            cell: info => new Date(info.getValue<string>()).toLocaleString('ar-EG', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', }),
        },
    ];

    const table = useReactTable({
        data: reports,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (loading) return <Loading />

    return (
        <div className="w-full rtl p-4">
            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <RejectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
            />
        </div>
    );
};

export default ApproveDataTable;
