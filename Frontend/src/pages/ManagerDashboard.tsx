import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ManagerDashboard.css";
import { useDashboard, shortId, dateLabel, trendPoints, initials } from "../useDashboard";
import type { MaintenanceRequest } from "../useDashboard";
import RequestEditor from "../components/RequestEditor";
import RequestUpdates from "../components/RequestUpdates";

function ManagerDashboard() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [activeMenu, setActiveMenu] = useState("Dashboard");
    const { user, requests: rawRequests, users, loading, error, reload, pending, active, completed, logout } = useDashboard();
    const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
    const technicians = users.filter((item) => item.role === "technician");
    const residents = users.filter((item) => item.role === "resident");
    const durations = rawRequests.filter((request) => request.status === "Completed" && request.completedAt).map((request) => (Date.parse(request.completedAt!) - Date.parse(request.createdAt)) / 86400000);
    const averageCompletion = durations.length ? `${(durations.reduce((sum, value) => sum + value, 0) / durations.length).toFixed(1)} Days` : "—";
    const filteredRequests = rawRequests.filter((request) => `${shortId(request._id)} ${request.title} ${request.category} ${request.resident?.fullName || ""} ${request.unitNumber}`.toLowerCase().includes(search.toLowerCase())).map((request) => ({
        ...request, id: shortId(request._id), resident: request.resident?.fullName || "Resident unavailable", unit: request.unitNumber, date: dateLabel(request.createdAt),
    }));
    const selectMenu = (menu: string) => {
        setActiveMenu(menu);
        document.getElementById(menu === "Notifications" ? "request-updates" : "maintenance-requests")?.scrollIntoView({ behavior: "smooth" });
    };

    return (

        <div className="manager-dashboard">
            {selectedRequest && <RequestEditor user={user} request={selectedRequest} technicians={technicians} onClose={() => setSelectedRequest(null)} onSaved={() => reload()} />}

            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <aside className="manager-sidebar">

                <div className="manager-logo">

                    <img
                        src="/livoralogo.png"
                        alt="Livora Logo"
                    />

                </div>


                {/* PROFILE */}

                <div className="manager-profile">

                    <div className="manager-avatar">{initials(user.fullName)}</div>

                    <div>

                        <h3>
                            {user.fullName}
                        </h3>

                        <p>
                            Apartment Manager
                        </p>

                    </div>

                </div>


                {/* NAVIGATION */}

                <nav className="manager-nav">

                    <button className={`manager-nav-item ${activeMenu === "Dashboard" ? "active" : ""}`} onClick={() => selectMenu("Dashboard")}>

                        <span>⌂</span>

                        Dashboard

                    </button>


                    <button className={`manager-nav-item ${activeMenu === "Requests" ? "active" : ""}`} onClick={() => selectMenu("Requests")}>

                        <span>📋</span>

                        Requests

                        <b className="manager-nav-badge">
                            {rawRequests.length}
                        </b>

                    </button>


                    <button className={`manager-nav-item ${activeMenu === "Residents" ? "active" : ""}`} onClick={() => selectMenu("Residents")}>

                        <span>👥</span>

                        Residents

                    </button>


                    <button className={`manager-nav-item ${activeMenu === "Technicians" ? "active" : ""}`} onClick={() => selectMenu("Technicians")}>

                        <span>🔧</span>

                        Technicians

                    </button>


                    <button className={`manager-nav-item ${activeMenu === "Notifications" ? "active" : ""}`} onClick={() => selectMenu("Notifications")}>

                        <span>🔔</span>

                        Notifications

                        <b className="manager-nav-badge notification">
                            {rawRequests.length}
                        </b>

                    </button>


                    <button className={`manager-nav-item ${activeMenu === "Profile" ? "active" : ""}`} onClick={() => selectMenu("Profile")}>

                        <span>👤</span>

                        Profile

                    </button>

                </nav>


                {/* BOTTOM */}

                <div className="manager-sidebar-bottom">

                    <button
                        onClick={() => navigate("/")}
                    >
                        ← Back to Home
                    </button>

                    <button onClick={logout}>
                        ⇥ Logout
                    </button>

                </div>

            </aside>


            {/* =====================================================
                MAIN
            ===================================================== */}

            <main className="manager-main">


                {/* =====================================================
                    TOP BAR
                ===================================================== */}

                <header className="manager-topbar">

                    <div className="manager-search">

                        <span>
                            ⌕
                        </span>

                        <input
                            type="text"
                            placeholder="Search requests, residents, technicians..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>


                    <div className="manager-top-right">

                        <div className="manager-notification">

                            🔔

                            <span>
                                {rawRequests.length}
                            </span>

                        </div>


                        <div className="manager-user">

                            <div className="manager-user-avatar">{initials(user.fullName)}</div>

                            <div>

                                <strong>
                                    {user.fullName}
                                </strong>

                                <small>
                                    Apartment Manager
                                </small>

                            </div>

                            <span>
                                ▾
                            </span>

                        </div>

                    </div>

                </header>


                {/* =====================================================
                    PAGE CONTENT
                ===================================================== */}

                <div className="manager-content">
                    {loading && <p role="status">Loading maintenance requests and users…</p>}
                    {error && <div className="integration-panel" role="alert">{error}<button onClick={() => void reload()}>Retry</button></div>}
                    {!loading && !error && !rawRequests.length && <p>No maintenance requests yet.</p>}
                    {activeMenu === "Profile" && <section className="integration-panel"><h2>Profile</h2><p>{user.fullName}<br />{user.email}<br />Apartment Manager</p></section>}
                    {(activeMenu === "Residents" || activeMenu === "Technicians") && <section className="integration-panel">
                        <h2>{activeMenu}</h2>
                        {(activeMenu === "Residents" ? residents : technicians).filter((item) => `${item.fullName} ${item.email} ${item.unitNumber || ""} ${item.speciality || ""}`.toLowerCase().includes(search.toLowerCase())).map((item) => <p key={item.id}><strong>{item.fullName}</strong><br />{item.email}<br />{item.unitNumber || item.speciality}</p>)}
                    </section>}


                    {/* =================================================
                        HERO
                    ================================================= */}

                    <section className="manager-hero">

                        <div className="manager-hero-overlay"></div>

                        <div className="manager-hero-content">

                            <span className="manager-welcome">
                                WELCOME BACK
                            </span>

                            <h1>
                                Manage your apartment
                                <br />
                                community with ease 🏢
                            </h1>

                            <p>
                                Monitor maintenance requests,
                                manage residents and technicians,
                                and keep your community running smoothly.
                            </p>

                            <button
                                onClick={() => {
                                    document
                                        .getElementById("maintenance-requests")
                                        ?.scrollIntoView({
                                            behavior: "smooth"
                                        });
                                }}
                            >
                                📋 View Requests
                            </button>

                        </div>

                    </section>


                    {/* =================================================
                        STATISTICS
                    ================================================= */}

                    <section className="manager-stats">


                        {/* TOTAL */}

                        <div className="manager-stat-card blue">

                            <div className="manager-stat-icon">
                                📋
                            </div>

                            <div className="manager-stat-info">

                                <span>
                                    Total Requests
                                </span>

                                <strong>
                                    {rawRequests.length}
                                </strong>

                                <small>
                                    All requests
                                </small>

                            </div>

                            <div className="manager-mini-chart">
                                <svg width="90" height="45" viewBox="0 0 100 50" aria-label="Requests created in the last seven days"><polyline points={trendPoints(rawRequests)} fill="none" stroke="currentColor" strokeWidth="3" /></svg>
                            </div>

                        </div>


                        {/* PENDING */}

                        <div className="manager-stat-card yellow">

                            <div className="manager-stat-icon">
                                ⏳
                            </div>

                            <div className="manager-stat-info">

                                <span>
                                    Pending
                                </span>

                                <strong>
                                    {pending}
                                </strong>

                                <small>
                                    Needs attention
                                </small>

                            </div>

                            <div className="manager-mini-chart">
                                <svg width="90" height="45" viewBox="0 0 100 50" aria-label="Requests created in the last seven days"><polyline points={trendPoints(rawRequests, "Pending")} fill="none" stroke="currentColor" strokeWidth="3" /></svg>
                            </div>

                        </div>


                        {/* IN PROGRESS */}

                        <div className="manager-stat-card purple">

                            <div className="manager-stat-icon">
                                🔧
                            </div>

                            <div className="manager-stat-info">

                                <span>
                                    In Progress
                                </span>

                                <strong>
                                    {active}
                                </strong>

                                <small>
                                    Being handled
                                </small>

                            </div>

                            <div className="manager-mini-chart">
                                <svg width="90" height="45" viewBox="0 0 100 50" aria-label="Requests created in the last seven days"><polyline points={trendPoints(rawRequests, "In Progress")} fill="none" stroke="currentColor" strokeWidth="3" /></svg>
                            </div>

                        </div>


                        {/* COMPLETED */}

                        <div className="manager-stat-card green">

                            <div className="manager-stat-icon">
                                ✓
                            </div>

                            <div className="manager-stat-info">

                                <span>
                                    Completed
                                </span>

                                <strong>
                                    {completed}
                                </strong>

                                <small>
                                    All requests
                                </small>

                            </div>

                            <div className="manager-mini-chart">
                                <svg width="90" height="45" viewBox="0 0 100 50" aria-label="Requests created in the last seven days"><polyline points={trendPoints(rawRequests, "Completed")} fill="none" stroke="currentColor" strokeWidth="3" /></svg>
                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        SECONDARY STATISTICS
                    ================================================= */}

                    <section className="manager-small-stats">

                        <div className="manager-small-card">

                            <div className="small-icon residents">
                                👥
                            </div>

                            <div>

                                <strong>
                                    {residents.length}
                                </strong>

                                <span>
                                    Residents
                                </span>

                            </div>

                        </div>


                        <div className="manager-small-card">

                            <div className="small-icon technicians">
                                🔧
                            </div>

                            <div>

                                <strong>
                                    {technicians.length}
                                </strong>

                                <span>
                                    Technicians
                                </span>

                            </div>

                        </div>


                        <div className="manager-small-card">

                            <div className="small-icon completion">
                                ⏱
                            </div>

                            <div>

                                <strong>
                                    {averageCompletion}
                                </strong>

                                <span>
                                    Average Completion
                                </span>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        LOWER SECTION
                    ================================================= */}

                    <section className="manager-lower-grid">


                        {/* =================================================
                            RECENT REQUESTS
                        ================================================= */}

                        <div
                            className="manager-requests-card"
                            id="maintenance-requests"
                        >

                            <div className="manager-section-header">

                                <div>

                                    <h2>
                                        📋 Recent Maintenance Requests
                                    </h2>

                                    <p>
                                        Monitor the latest maintenance requests.
                                    </p>

                                </div>

                                <button onClick={() => selectMenu("Requests")}>
                                    View All →
                                </button>

                            </div>


                            <div className="manager-table-wrapper">

                                <table className="manager-table">

                                    <thead>

                                        <tr>

                                            <th>ID</th>

                                            <th>
                                                Request Details
                                            </th>

                                            <th>
                                                Resident
                                            </th>

                                            <th>
                                                Unit
                                            </th>

                                            <th>
                                                Priority
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                            <th>
                                                Date
                                            </th>

                                            <th>
                                                Action
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {filteredRequests.map((request) => (

                                            <tr key={request.id}>

                                                <td>
                                                    <strong>
                                                        {request.id}
                                                    </strong>
                                                </td>


                                                <td>

                                                    <div className="manager-request-detail">

                                                        <div className="manager-request-icon">

                                                            {request.category.includes("Electrical")
                                                                ? "💡"
                                                                : request.category.includes("Plumbing")
                                                                ? "🔧"
                                                                : "🛠️"}

                                                        </div>

                                                        <div>

                                                            <strong>
                                                                {request.title}
                                                            </strong>

                                                            <small>
                                                                {request.description}
                                                            </small>

                                                        </div>

                                                    </div>

                                                </td>


                                                <td>
                                                    {request.resident}
                                                </td>


                                                <td>
                                                    {request.unit}
                                                </td>


                                                <td>

                                                    <span
                                                        className={`manager-priority ${request.priority.toLowerCase()}`}
                                                    >
                                                        {request.priority}
                                                    </span>

                                                </td>


                                                <td>

                                                    <span
                                                        className={`manager-status ${request.status
                                                            .toLowerCase()
                                                            .replace(" ", "-")}`}
                                                    >
                                                        {request.status}
                                                    </span>

                                                </td>


                                                <td>
                                                    {request.date}
                                                </td>


                                                <td>

                                                    <button className="manager-view-btn" onClick={() => setSelectedRequest(rawRequests.find((item) => item._id === request._id) || null)}>
                                                        View
                                                    </button>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </div>


                        {/* =================================================
                            RIGHT COLUMN
                        ================================================= */}

                        <div className="manager-right-column">


                            {/* QUICK ACTIONS */}

                            <div className="manager-side-card">

                                <h2>
                                    ⚡ Quick Actions
                                </h2>


                                <button className="manager-action" onClick={() => selectMenu("Requests")}>

                                    <span className="action-icon blue-action">
                                        📋
                                    </span>

                                    <span>
                                        Manage Requests
                                    </span>

                                    <b>
                                        ›
                                    </b>

                                </button>


                                <button className="manager-action" onClick={() => selectMenu("Residents")}>

                                    <span className="action-icon purple-action">
                                        👥
                                    </span>

                                    <span>
                                        Manage Residents
                                    </span>

                                    <b>
                                        ›
                                    </b>

                                </button>


                                <button className="manager-action" onClick={() => selectMenu("Technicians")}>

                                    <span className="action-icon green-action">
                                        🔧
                                    </span>

                                    <span>
                                        Manage Technicians
                                    </span>

                                    <b>
                                        ›
                                    </b>

                                </button>


                                <button className="manager-action" onClick={() => selectMenu("Notifications")}>

                                    <span className="action-icon orange-action">
                                        🔔
                                    </span>

                                    <span>
                                        Notifications
                                    </span>

                                    <b className="manager-action-badge">
                                        {rawRequests.length}
                                    </b>

                                </button>

                            </div>


                            {/* =================================================
                                TECHNICIAN OVERVIEW
                            ================================================= */}

                            <div className="manager-side-card">

                                <div className="manager-side-title" id="technician-overview">

                                    <h2>
                                        🔧 Technician Overview
                                    </h2>

                                    <a href="#technician-overview" onClick={() => selectMenu("Technicians")}>
                                        View All
                                    </a>

                                </div>


                                {!technicians.length && <p>No technicians registered yet.</p>}
                                {technicians.map((technician) => {
                                    const busy = rawRequests.some((request) => request.assignedTechnician?._id === technician.id && request.status !== "Completed");
                                    const available = technician.available !== false && !busy;
                                    return <div className="technician-row" key={technician.id}>
                                        <div className="technician-avatar">{initials(technician.fullName)}</div>
                                        <div className="technician-info"><strong>{technician.fullName}</strong><small>{technician.speciality}</small></div>
                                        <span className={available ? "available" : "busy"}>{available ? "Available" : busy ? "Busy" : "Unavailable"}</span>
                                    </div>;
                                })}

                            </div>


                            {/* =================================================
                                NOTIFICATIONS
                            ================================================= */}

                            <div className="manager-side-card">

                                <h2>
                                    🔔 Recent Notifications
                                </h2>


                                <RequestUpdates requests={rawRequests} manager />

                            </div>

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}

export default ManagerDashboard;
