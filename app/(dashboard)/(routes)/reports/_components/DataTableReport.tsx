'use client';
import * as React from 'react';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import AddRootCause from "./AddRootCauseModal";
import { useAuth } from "@/app/context/AuthContext";
import AddCorrectiveAction from "./CorrectiveActionModal";
import axios from "axios";
import { toast } from "sonner";
import LanguageContext from "@/app/context/LanguageContext";
import DeleteRequest from "./DeleteRequestModal";
import UpdateInspectionModal from "./UpdateInspectionModal";
import UploadAttachmentModal from './UploadAttachmentModal';
import useTranslation from "@/app/hooks/useTranslation";
import FullScreenImageModal from '@/app/(dashboard)/_components/FullScreenImageModal';

export type InspectionAttachment = {
    id: string;
    inspectionId: string;
    name: string;
    path: string;
};


export type Inspection = {
    id: string;
    image: string;
    rootCause: string;
    correctiveAction: string;
    isClosed: boolean;
    idOfBus: number;
    noteClassification: string;
    description: string;
    enDescription: string;
    requirement: string;
    attachment: InspectionAttachment | null;
};

export type Report = {
    id: number;
    nameOfStation: string;
    nameOfSchool: string;
    inspections: Inspection[];
};

export function DataTableReport({ report, setIsRootCauseAdded, setIsCorrectiveActionAdded, setIsInspectionClose, setIsDeleteRequestDone }: any) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const [isOpenRootCause, setIsOpenRootCause] = React.useState(false)
    const [rootCause, setRootCause] = React.useState('')

    const [isOpenCorrectiveAction, setIsOpenCorrectiveAction] = React.useState(false)
    const [correctiveAction, setCorrectiveAction] = React.useState('')

    const [inspectionId, setInspectionId] = React.useState('')

    const [isOpenDeleteRequest, setIsOpenDeleteRequest] = React.useState(false)

    const [selectedInspection, setSelectedInspection] = React.useState<Inspection | null>(null);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = React.useState(false);
    const [isOpenUploadAttachment, setIsOpenUploadAttachment] = React.useState(false); // Add state for attachment modal

    const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = React.useState<string | null>(null);

    const handleUpdateInspection = async (inspectionId: string, updates: any) => {
        try {
            await axios.patch('/api/update_inspection_details', { inspectionId, ...updates });
            toast.success('Inspection details updated successfully');
            setIsRootCauseAdded((prev: boolean) => !prev);
            setIsCorrectiveActionAdded((prev: boolean) => !prev);
        } catch (error) {
            console.error('Error updating inspection details:', error);
            toast.error('Failed to update inspection details');
        }
    };

    const renderAttachment = (attachment: [InspectionAttachment] | null) => {
        if (!attachment?.length) {
            return 'no attachment';
        }

        const { path, name } = attachment[0];
        const fileExtension: any = path.split('.').pop()?.toLowerCase();
        console.log(fileExtension);

        if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
            return (
                <img
                    src={path}
                    alt={name}
                    width="100"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                        setSelectedImageUrl(path);
                        setIsImageModalOpen(true);
                    }}
                />
            );
        } else {
            return (
                <a href={path} target="_blank" rel="noopener noreferrer">
                    View Attachment
                </a>
            );
        }
    };

    const handleEditDetails = (inspection: Inspection) => {
        setSelectedInspection(inspection);
        setIsOpenUpdateModal(true);
    };

    const handleUploadAttachment = (inspection: Inspection) => {
        setSelectedInspection(inspection);
        setIsOpenUploadAttachment(true);
    };

    const handleCloseInspection = async (isClosed: boolean, inspectionId: string) => {
        try {
            const dataSend = {
                isClosed,
                inspectionId
            }

            await axios.patch('/api/close_inspection', dataSend)
            setIsInspectionClose((prev: boolean) => !prev)
            toast.success('تم')

        } catch (error) {
            console.log(error);
        }
    }

    const { user } = useAuth()
    const { t } = useTranslation()
    const { language } = React.useContext(LanguageContext);

    const handleAddRootCause = async (rootCause: any, inspectionId: string) => {
        setIsOpenRootCause(true)
        setRootCause(rootCause == null ? '' : rootCause)
        setInspectionId(inspectionId)
    }

    const handleAddCorrectiveAction = async (correctiveAction: any, inspectionId: string) => {
        setIsOpenCorrectiveAction(true)
        setCorrectiveAction(correctiveAction == null ? '' : correctiveAction)
        setInspectionId(inspectionId)
    }

    const handleDeleteRequest = async (inspectionId: string) => {
        setIsOpenDeleteRequest(true)
        setInspectionId(inspectionId)
    }

    const columns: ColumnDef<Inspection>[] = [
        {
            accessorKey: "id",
            header: () => <div className="text-center">م <br />no</div>,
            cell: ({ row }) => <div>{row.index + 1}</div>,
        },
        {
            accessorKey: "image",
            header: () => <div className="text-center">صورة <br /> photo</div>,
            cell: ({ row }) => (
                <div>
                    <img
                        src={row.getValue("image")}
                        alt='inspection image'
                        width="100"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            setSelectedImageUrl(row.getValue("image"));
                            setIsImageModalOpen(true);
                        }}
                    />
                </div>
            ),
        },
        {
            accessorKey: "requirement",
            header: () => <div className="text-center">المتطلب <br /> requirement</div>,
            cell: ({ row }) => {
                const requirement = row.getValue("requirement") as string
                return (
                    <div className="flex flex-col gap-1 text-center">{requirement.split('|')[0]} <hr /> <span>{requirement.split('|')[1]}</span></div>
                )
            },
        },
        {
            accessorKey: "idOfBus",
            header: () => <div className="text-center">الدليل (BOO)</div>,
            cell: ({ row }) => <div>{row.getValue("idOfBus")}</div>,
        },
        {
            accessorKey: 'description',
            header: () => <div className="text-center">وصف الملاحظة <br /> Description of the note</div>,
            cell: ({ row }) => (
                <div className="max-w-[200px] flex flex-col gap-1 text-center">
                    {row.getValue('description')}
                    <hr />
                    <span className="text-center">{row.original.enDescription}</span>
                </div>
            ),
        },
        {
            accessorKey: "noteClassification",
            header: () => <div className="text-center">تصنيف الملاحظة <br /> Note classification</div>,
            cell: ({ row }) => (
                <div className="capitalize">{t('secondary')}</div>
                // <div className="capitalize">{row.getValue("noteClassification")}</div>
            ),
        },
        {
            accessorKey: "rootCause",
            header: () => <div className="text-center">السبب الجذري <br /> Root cause</div>,
            cell: ({ row }) => <div className='max-w-80 text-wrap break-words'>{row.getValue("rootCause")}</div>,
        },
        {
            accessorKey: "correctiveAction",
            header: () => <div className="text-center">الإجراء التصحيحي <br /> Corrective action</div>,
            cell: ({ row }) => <div className='max-w-80 text-wrap break-words'>{row.getValue("correctiveAction")}</div>,
        },
        {
            accessorKey: "attachment",
            header: () => <div className="text-center">Attachment</div>,
            cell: ({ row }) => {
                const attachment = row.getValue("attachment") as [InspectionAttachment] | null;
                return renderAttachment(attachment);
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const inspection = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            {
                                user?.role?.name === 'OPERATIONS_MANAGER'
                                    ?
                                    <>
                                        <DropdownMenuItem onClick={() => handleAddRootCause(inspection.rootCause, inspection.id)}>
                                            {inspection.rootCause ? t('Modify root cause') : t('Adding a root cause')}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAddCorrectiveAction(inspection.correctiveAction, inspection.id)}>
                                            {inspection.correctiveAction ? t('Modify corrective action') : t('Add a corrective action')}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleUploadAttachment(row.original)}>
                                            Upload Attachment
                                        </DropdownMenuItem>
                                    </>
                                    :
                                    <>
                                        {
                                            inspection.rootCause && inspection.correctiveAction
                                            &&
                                            <DropdownMenuItem onClick={() => { handleCloseInspection(!inspection.isClosed, inspection.id) }}>{inspection.isClosed ? t('Open inspection') : t('Closing the inspection')}</DropdownMenuItem>
                                        }
                                        <DropdownMenuItem onClick={() => handleEditDetails(inspection)}>
                                            {t('Update Inspection Requirement')}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => { handleDeleteRequest(inspection.id) }}>{t('Delete the note')}</DropdownMenuItem>
                                    </>
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data: report.inspections,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full rtl">
            <div className="flex items-center py-4">
                {/* <Input
                    placeholder="إسم التفتيش..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                /> */}
                {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu> */}
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className={row.original.isClosed ? 'bg-red-600 text-white hover:bg-red-700' : ''}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className={cell.id.split('_').includes('select') ? 'pr-[1rem!important] text-center' : 'text-center'}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
            <AddRootCause isOpen={isOpenRootCause} onClose={() => { setIsOpenRootCause(false) }} rootCause={rootCause} inspectionId={inspectionId} setIsRootCauseAdded={setIsRootCauseAdded} />
            <AddCorrectiveAction isOpen={isOpenCorrectiveAction} onClose={() => { setIsOpenCorrectiveAction(false) }} correctiveAction={correctiveAction} inspectionId={inspectionId} setIsCorrectiveActionAdded={setIsCorrectiveActionAdded} />
            <DeleteRequest isOpen={isOpenDeleteRequest} inspectionId={inspectionId} onClose={() => { setIsOpenDeleteRequest(false) }} setIsDeleteRequestDone={setIsDeleteRequestDone} />
            {selectedInspection && (
                <UpdateInspectionModal
                    inspectionTypeName={report?.inspectionType?.name}
                    isOpen={isOpenUpdateModal}
                    onClose={() => setIsOpenUpdateModal(false)}
                    inspectionId={selectedInspection.id}
                    requirement={selectedInspection.requirement}
                    description={selectedInspection.description}
                    setInspectionUpdated={(value: any) => handleUpdateInspection(selectedInspection.id, value)}
                />
            )}
            {selectedInspection && (
                <UploadAttachmentModal
                    isOpen={isOpenUploadAttachment}
                    onClose={() => setIsOpenUploadAttachment(false)}
                    inspectionId={selectedInspection.id}
                    setAttachmentAdded={setIsRootCauseAdded}
                />
            )}
            <FullScreenImageModal
                isOpen={isImageModalOpen}
                onClose={() => setIsImageModalOpen(false)}
                imageUrl={selectedImageUrl || ''}
            />
        </div>
    );
}
