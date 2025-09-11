import { CreateNewUserModal } from "./CreateNewUserModal";
import { SingleUserUpdateModalController, UserUpdateModalController } from "./UpdateUserModal";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/api/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Input } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { formatName } from "@/lib/format-name";
import { UserData } from "@/types/UserData";

import { UserCog } from "lucide-react";

export function UsersManagement() {
    // Pagination & search state
    const [page, setPage] = useState<number>(1);
    const [pageSize] = useState<number>(10);
    const [search, setSearch] = useState<string>("");

    const { data, isLoading, refetch, isError } = useQuery({
        queryKey: ["admin", "users", page, pageSize, search],
        queryFn: () => getUsers(page, pageSize, search),
    });

    const typedData = data as { users: UserData[]; total: number } | undefined;
    const users = useMemo<UserData[]>(() => typedData?.users ?? [], [typedData]);
    const total = typedData?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const OpenUpdateModal = (user : UserData) => {
        console.log('Button clicked!');
    };

    useEffect(() => {
        // reset to first page when search changes
        setPage(1);
    }, [search]);

    const [singleUserUpdateOpen, setSingleUserUpdateOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    
    const handleUserRowClick = (userId: number) => {
        console.log('Row clicked for userId:', userId);
        setSelectedUserId(userId);
        setSingleUserUpdateOpen(true);
    }

    return (
        <>
        <SingleUserUpdateModalController
            userId={selectedUserId}
            open={singleUserUpdateOpen}
            setOpen={setSingleUserUpdateOpen}
        />

        <div className="space-y-6">
            <div className="p-6 bg-gray-800 rounded-lg">
                <h2 className="mb-4 text-2xl font-bold text-white">
                    Users Management
                </h2>
                <p className="text-gray-300">
                    Here you can manage users, their roles, and permissions.
                </p>
            </div>

            <div className="flex flex-row justify-center items-center gap-1">
                <CreateNewUserModal />

                <UserUpdateModalController triggerElement={<Button
                        variant="default"
                        className="h-16 flex-1 bg-purple-600 hover:bg-purple-700 text-xl"
                    >
                        <div className="flex items-center gap-2">
                            <UserCog className="!w-8 !h-8" />
                            <span>Update User</span>
                        </div>
                    </Button>}/>
            </div>

            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Search users by name or id"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-gray-700 text-white"
                        />
                        <Button onClick={() => refetch()} className="bg-purple-600 hover:bg-purple-700">Search</Button>
                    </div>
                    <div className="text-gray-300">Total users: {total}</div>
                </div>

                <div className="mt-6">
                    {isLoading ? (
                        <div className="text-center text-gray-300">Loading users...</div>
                    ) : isError ? (
                        <div className="text-center text-red-400">Failed to load users</div>
                    ) : (
                        <Table className="mt-4 border border-gray-700 rounded-lg overflow-hidden text-lg">
                            <TableHeader className="bg-gray-800">
                                <TableRow>
                                    <TableHead className="text-gray-300 py-4 px-6">ID</TableHead>
                                    <TableHead className="text-gray-300 py-4 px-6">Username</TableHead>
                                    <TableHead className="text-gray-300 py-4 px-6">Trained</TableHead>
                                    <TableHead className="text-gray-300 py-4 px-6">Admin</TableHead>
                                    <TableHead className="text-gray-300 py-4 px-6">Weekly Minutes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((u) => (
                                    <TableRow key={u.id} className="hover:bg-gray-700" onClick={() => handleUserRowClick(u.id)} >
                                        <TableCell className="py-4 px-6">{u.id}</TableCell>
                                        <TableCell className="py-4 px-6">{formatName(u.username)}</TableCell>
                                        <TableCell className="py-4 px-6">{u.trained ? "Yes" : "No"}</TableCell>
                                        <TableCell className="py-4 px-6">{u.admin ? "Yes" : "No"}</TableCell>
                                        <TableCell className="py-4 px-6">{u.weekly_minutes}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    <div className="flex items-center justify-between mt-4">
                        <div className="text-gray-300">Page {page} / {totalPages}</div>
                        <div className="flex items-center gap-2">
                            <Button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-4 py-2">Prev</Button>
                            <Button disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-4 py-2">Next</Button>
                        </div>
                    </div>
                </div>
            </div>


        </div>
        </>

    );
}
