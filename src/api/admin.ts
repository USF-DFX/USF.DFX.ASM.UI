import { UserData } from "@/types/UserData";
import { api } from "./api-base";

export async function getUserData(scannerMessage: string): Promise<UserData> {
    const response = await api.post<UserData>(`/admin/users/getUser`, {
        scanner_message: scannerMessage,
    });
    return response.data;
}

export async function getUserById(userId: number): Promise<UserData> {
    const response = await api.get<UserData>(`/admin/users/getUserById/${userId}`);
    return response.data;
}

export async function createUser(
    scanner_message: string,
    trained: boolean,
    admin: boolean,
    egn_Lab: boolean
): Promise<boolean> {
    try {
        const response = await api.post<{ success: boolean }>(
            "/admin/users/create",
            {
                scanner_message,
                trained,
                admin,
                egn_Lab,
            }
        );
        return response.data.success;
    } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user. Try again.");
    }
}

export async function setTrained(userId: number): Promise<boolean> {
    try {
        const response = await api.put<{ success: boolean }>(
            `/admin/users/setTrained/${userId}`
        );

        return response.data.success;
    } catch (error) {
        console.error("Error setting using trained status");
        throw new Error("Failed to update user trained status. Try again.");
    }
}

export async function setExecutiveAccess(userId: number): Promise<boolean> {
    try {
        const response = await api.put<{ success: boolean }>(
            `/admin/users/setExecutiveAccess/${userId}`
        );

        return response.data.success;
    } catch (error) {
        console.error("Error setting using executive status");
        throw new Error("Failed to update user executive status. Try again.");
    }
}

export async function setAdmin(userId: number): Promise<boolean> {
    try {
        const response = await api.put<{ success: boolean }>(
            `/admin/users/setAdmin/${userId}`
        );

        return response.data.success;
    } catch (error) {
        console.error("Error setting admin status for user");
        throw new Error("Failed to update user admin status. Try again.");
    }
}

export async function addWeeklyMinutes(
    userId: number,
    minutes: number
): Promise<boolean> {
    try {
        const response = await api.put<{ success: boolean }>(
            `/admin/users/addWeeklyMinutes/${userId}`,
            { minutes }
        );

        return response.data.success;
    } catch (error) {
        console.error("Error adding weekly minutes");
        throw new Error("Failed to add weekly minutes. Try again.");
    }
}

export async function setBanTime(
    userId: number,
    banTime: number
): Promise<boolean> {
    try {
        const response = await api.put<{ success: boolean }>(
            `/admin/users/setBanTime/${userId}`,
            { ban_time: banTime }
        );

        return response.data.success;
    } catch (error) {
        console.error("Error setting ban time");
        throw new Error("Failed to set ban time. Try again.");
    }
}

export async function exportDB(table: string): Promise<boolean> {
    const response = await api.post<boolean>("admin/data/exportDB", {
        table: table,
    });
    return response.data;
}

export async function importDB(): Promise<boolean> {
    const response = await api.get<boolean>("admin/data/importDB");
    return response.data;
}

export async function ejectUSB(): Promise<boolean> {
    const response = await api.put<boolean>("admin/data/ejectUSB");
    return response.data;
}

// Fetch paginated users. Backend is expected to accept query params: page, page_size, search
export async function getUsers(
    page: number,
    pageSize: number,
    search?: string
): Promise<{ users: UserData[]; total: number }> {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("page_size", String(pageSize));
    if (search) params.append("search", search);

    console.log("Fetching users with params:", params.toString());
    const response = await api.get<{ users: UserData[]; total: number }>(
        `/admin/users/getUsers/${search}/${page}/${pageSize}`
    );

    return response.data;
}
