import axios from "axios";

export type Role = "resident" | "technician" | "manager";
export interface User {
    id: string;
    _id: string;
    fullName: string;
    email: string;
    role: Role;
    unitNumber?: string;
    speciality?: string;
    available?: boolean;
}

export function clearSession() {
    for (const storage of [localStorage, sessionStorage]) {
        storage.removeItem("token");
        storage.removeItem("user");
    }
}

export function saveSession(token: string, user: User, remember: boolean) {
    clearSession();
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("token", token);
    storage.setItem("user", JSON.stringify(user));
}

export function getToken() {
    return sessionStorage.getItem("token") || localStorage.getItem("token");
}

export function apiError(error: unknown) {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || (error.response ? "The request failed. Please try again." : "Cannot reach the backend. Check that it is running and connected to MongoDB.");
    }
    return "Something went wrong. Please try again.";
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    withCredentials: true,
    timeout: 15000,
});

api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
