import { useCallback, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import api, { apiError, clearSession } from "./api";
import type { User } from "./api";

export interface MaintenanceRequest {
    _id: string;
    title: string;
    description: string;
    priority: "High" | "Medium" | "Low";
    status: "Pending" | "In Progress" | "Completed";
    category: string;
    unitNumber: string;
    resident: User | null;
    assignedTechnician: User | null;
    createdAt: string;
    updatedAt: string;
    completedAt?: string | null;
}

export const shortId = (id: string) => `#${id.slice(-6)}`;
export const dateLabel = (date: string) => new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
export const initials = (name: string) => name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();

export function trendPoints(requests: MaintenanceRequest[], status?: MaintenanceRequest["status"]) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const counts = Array.from({ length: 7 }, (_, index) => {
        const start = today.getTime() - (6 - index) * 86400000;
        return requests.filter((request) => (!status || request.status === status) && Date.parse(request.createdAt) >= start && Date.parse(request.createdAt) < start + 86400000).length;
    });
    const maximum = Math.max(1, ...counts);
    return counts.map((count, index) => `${index * 100 / 6},${45 - count / maximum * 40}`).join(" ");
}

export function useDashboard() {
    const { user } = useOutletContext<{ user: User }>();
    const navigate = useNavigate();
    const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const load = useCallback((signal?: AbortSignal) => {
        return Promise.all([
                api.get<{ requests: MaintenanceRequest[] }>("/requests", { signal }),
                user.role === "manager" ? api.get<{ users: User[] }>("/auth/users", { signal }) : Promise.resolve(null),
            ]).then(([requestResult, usersResult]) => {
            if (signal?.aborted) return;
            setError("");
            setRequests(requestResult.data.requests);
            if (usersResult) setUsers(usersResult.data.users);
        }).catch((error) => {
            if (signal?.aborted) return;
            if (error.response?.status === 401) {
                clearSession();
                navigate(`/login?role=${user.role}`, { replace: true });
                return;
            }
            setError(apiError(error));
        }).finally(() => {
            if (!signal?.aborted) setLoading(false);
        });
    }, [user.role, navigate]);
    useEffect(() => {
        const controller = new AbortController();
        void load(controller.signal);
        return () => controller.abort();
    }, [load]);
    const pending = requests.filter((request) => request.status === "Pending").length;
    const active = requests.filter((request) => request.status === "In Progress").length;
    const completed = requests.filter((request) => request.status === "Completed").length;
    const completionRate = requests.length ? Math.round(completed / requests.length * 100) : 0;
    const logout = () => { clearSession(); navigate("/login", { replace: true }); };
    const reload = async () => { setLoading(true); setError(""); await load(); };
    return { user, requests, users, loading, error, reload, pending, active, completed, completionRate, logout };
}
