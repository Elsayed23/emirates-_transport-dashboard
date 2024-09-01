'use client';

import * as React from "react";
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
import axios from "axios";
import Loading from "../../../_components/Loading";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useTranslation from "@/app/hooks/useTranslation";
import LanguageContext from "@/app/context/LanguageContext";
import AddTaskModal from "./AddTaskModal";

export type User = {
    id: string;
    name: string;
    email: string;
};


const SafetyOfficersDataTable = () => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );

    const [user_id, setUser_id] = React.useState('')
    const [isOpenAddTask, setIsOpenAddTask] = React.useState(false)

    const [data, setData] = React.useState<User[]>([]);
    const [loading, setLoading] = React.useState(true);
    const router = useRouter()

    const { language } = React.useContext(LanguageContext);


    const handleAddTask = (user_id: string) => {
        setIsOpenAddTask(true),
            setUser_id(user_id)
    }



    const { t } = useTranslation()

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "id",
            header: () => <div className={language === 'ar' ? 'text-right' : 'text-left'}>م <br /> no</div>,
            cell: ({ row }) => <div>{row.index + 1}</div>,
        },
        {
            accessorKey: "name",
            header: () => <div className={language === 'ar' ? 'text-right' : 'text-left'}>{t('Name')}</div>,
            cell: ({ row }) => {
                return <div>{row.getValue('name')}</div>
            },

        },
        {
            accessorKey: "email",
            header: () => <div className={language === 'ar' ? 'text-right' : 'text-left'}>{t('Mail')}</div>,
            cell: ({ row }) => {
                return <div>{row.getValue('email')}</div>
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <Button onClick={() => { handleAddTask(user.id) }}>{t('Add mission')}</Button>
                );
            },
        },
    ];


    const getUsers = async () => {
        const { data } = await axios.get('/api/safety_officer/all')
        setData(data)
        console.log(data);

        setLoading(false)
    }

    React.useEffect(() => {
        getUsers()
    }, [])


    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
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

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center py-4">
                <Input
                    placeholder={t('Search for a user by name')}
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                    className="max-w-sm"
                />
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
                                    // onClick={() => router.push(`/violations/${row.original.id}`)}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
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
            {/* <AddUserModal isOpen={isOpenAddUser} onClose={() => { setIsOpenAddUser(false) }} setData={setData} /> */}
            <AddTaskModal isOpen={isOpenAddTask} onClose={() => { setIsOpenAddTask(false) }} user_id={user_id} />
        </div>
    );
};

export default SafetyOfficersDataTable;
