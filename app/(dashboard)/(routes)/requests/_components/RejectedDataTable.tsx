'use client';

import * as React from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Loading from '@/app/(dashboard)/_components/Loading';

type Inspection = {
    id: string;
    name: string;
    image: string;
    idOfBus: number;
    description: string;
};

type Report = {
    id: string;
    stationId: number;
    user: {
        name: string;
    };
    nameOfStation: string;
    city: string;
    rejectionReason: string;
    inspections: Inspection[];
    createdAt: string;
};

const RejectedReportsDataTable = ({ toggleRejectedReport }: any) => {
    const [reports, setReports] = React.useState<Report[]>([]);
    const [loading, setLoading] = React.useState(true);

    const getRejectedReports = async () => {
        try {
            const { data } = await axios.get('/api/reports/rejected');
            setReports(data);
            setLoading(false);

        } catch (error) {
            console.error('Error fetching rejected reports:', error);
            toast.error('Failed to fetch rejected reports');
            setLoading(false);
        }
    }

    React.useEffect(() => {
        getRejectedReports();
    }, [toggleRejectedReport]);

    const columns: ColumnDef<Report>[] = [
        {
            accessorKey: 'nameOfStation',
            header: () => <div className="text-right">المحطة</div>,
            cell: info => info.getValue(),
        },
        {
            accessorKey: 'city',
            header: () => <div className="text-right">المدينة</div>,
            cell: info => info.getValue(),
        },
        {
            accessorKey: 'user.name',
            header: () => <div className="text-right">اسم الضابط</div>,
            cell: info => info.getValue(),
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
            accessorKey: 'rejectionReason',
            header: () => <div className="text-right">سبب الرفض</div>,
            cell: info => info.getValue(),
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

    if (loading) {
        return <Loading />;
    }

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
                                <TableRow key={row.id}>
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
        </div>
    );
};

export default RejectedReportsDataTable;
