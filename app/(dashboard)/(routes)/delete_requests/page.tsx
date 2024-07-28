'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import RejectModal from './_components/RejectModal';
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

type DeleteRequest = {
  id: string;
  reason: string;
  status: string;
  rejectionReason?: string;
  createdAt: string;
  inspection: {
    id: string;
    reportId: string;
    description: string
  };
};

const page: React.FC = () => {
  const [requests, setRequests] = useState<DeleteRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('/api/delete_request'); // Assuming a GET endpoint to fetch all requests
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching delete requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const handleAction = async (requestId: string, action: string, reason: string = '') => {
    try {
      const data: { requestId: string; action: string; rejectionReason?: string } = { requestId, action };
      if (action === 'REJECT') {
        data.rejectionReason = reason;
      }

      await axios.patch('/api/delete_request', data);
      toast.success(`Request sent successfully`);
      setRequests(requests.filter(request => request.id !== requestId));
    } catch (error) {
      console.error(`Error ${action.toLowerCase()}ing request:`, error);
      toast.error(`Failed to ${action.toLowerCase()} request`);
    }
  };


  const handleReject = (requestId: string) => {
    setCurrentRequestId(requestId);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (reason: string) => {
    if (currentRequestId) {
      await handleAction(currentRequestId, 'REJECT', reason);
    }
  };

  const columns: ColumnDef<DeleteRequest>[] = [
    {
      accessorKey: 'reason',
      header: () => <div className="text-right">السبب</div>,
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'inspection.description',
      header: () => <div className="text-right">الملاحظة</div>,
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'inspection.reportId',
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
        const request = row.original;
        return (
          <div className="flex items-center justify-start gap-3">
            <Button onClick={() => handleAction(request.id, 'APPROVE')} variant='outline'>موافقة</Button>
            <Button onClick={() => handleReject(request.id)} variant='destructive'>رفض</Button>
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: () => <div className="text-right">تاريخ الطلب</div>,
      cell: info => new Date(info.getValue<string>()).toLocaleString('ar'),
    },
  ];

  const table = useReactTable({
    data: requests,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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

export default page;
