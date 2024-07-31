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
import AddUserModal from "./AddUserModal";
import ModifyUser from "./ModifyStationModal";

export type User = {
    id: string;
    name: string;
    email: string;
    role: { id: string, name: string };
};


const UsersDataTable = () => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );


    const [stationId, setStationId] = React.useState('')

    const [data, setData] = React.useState<User[]>([]);
    const [loading, setLoading] = React.useState(true);

    const [isOpenModifyUser, setIsOpenModifyUser] = React.useState(false)

    const router = useRouter()

    const { language } = React.useContext(LanguageContext);

    const handleModifyUser = (stationId: string) => {
        setIsOpenModifyUser(true)
        setStationId(stationId)
    }


    const handleDeleteUser = async (id: string) => {
        const { data } = await axios.delete('/api/users', {
            data: {
                id
            }
        })

        setData(data)
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
                const role = row.getValue('role') as { name: string }
                return <div>{role?.name === 'STATION' ? t(`filteredStationsData.${row.getValue('name')}`) : row.getValue('name')}</div>
            },

        },
        {
            accessorKey: "role",
            header: () => <div className={language === 'ar' ? 'text-right' : 'text-left'}>{t('Role')}</div>,
            cell: ({ row }) => {
                const role = row.getValue('role') as { name: string }
                return <div>{t(`roles.${role?.name}`)}</div>
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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(user.email)}
                            >
                                {t('Copy mail')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {/* <DropdownMenuItem
                                onClick={() => { router.push(`/profile/${user.id}`) }}
                            >
                                User profile
                            </DropdownMenuItem> */}
                            {
                                user.role.name !== 'OPERATIONS_MANAGER'
                                    ?
                                    <DropdownMenuItem
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        {t('User deletion')}
                                    </DropdownMenuItem>
                                    :
                                    <DropdownMenuItem
                                        onClick={() => handleModifyUser(user.id)}
                                    >
                                        {t('Edit information')}
                                    </DropdownMenuItem>
                            }

                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];


    const [isOpenAddUser, setIsOpenAddUser] = React.useState(false)


    const getUsers = async () => {
        const { data } = await axios.get('/api/users')
        setData(data)
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
                <Button onClick={() => { setIsOpenAddUser(true) }}>{t('Adding user')}</Button>
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
            <AddUserModal isOpen={isOpenAddUser} onClose={() => { setIsOpenAddUser(false) }} setData={setData} />
            <ModifyUser isOpen={isOpenModifyUser} onClose={() => { setIsOpenModifyUser(false) }} setData={setData} stationId={stationId} />
        </div>
    );
};

export default UsersDataTable;
