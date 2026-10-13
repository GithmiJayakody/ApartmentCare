import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import api, { apiError, clearSession, getToken } from "../api";
import type { Role, User } from "../api";

export default function ProtectedRoute({ role }: { role: Role }) {
    const location = useLocation();
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState("");
    const [unauthorized, setUnauthorized] = useState(false);
    useEffect(() => {
        if (!getToken()) return;
        const controller = new AbortController();
        api.get<{ user: User }>("/auth/me", { signal: controller.signal }).then(({ data }) => {
            setUser(data.user);
        }).catch((error) => {
            if (controller.signal.aborted) return;
            if (error.response?.status === 401) {
                clearSession();
                setUnauthorized(true);
            } else setError(apiError(error));
        });
        return () => controller.abort();
    }, []);
    if (!getToken() || unauthorized) return <Navigate to={`/login?role=${role}`} state={{ from: location.pathname }} replace />;
    if (error) return <div className="integration-panel" role="alert">{error} <button onClick={() => window.location.reload()}>Retry</button></div>;
    if (!user) return <div className="integration-panel" role="status">Loading your account…</div>;
    if (user.role !== role) return <Navigate to={`/${user.role}-dashboard`} replace />;
    return <Outlet context={{ user }} />;
}
