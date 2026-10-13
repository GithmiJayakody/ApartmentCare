import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TechnicianDashboard.css";
import { useDashboard, shortId, dateLabel, trendPoints, initials } from "../useDashboard";
import type { MaintenanceRequest } from "../useDashboard";
import RequestEditor from "../components/RequestEditor";
import RequestUpdates from "../components/RequestUpdates";
import api, { apiError } from "../api";

function TechnicianDashboard() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [activeMenu, setActiveMenu] = useState("Dashboard");
    const { user, requests, loading, error, reload, pending, active, completed, completionRate, logout } = useDashboard();
    const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
    const [available, setAvailable] = useState(user.available !== false);
    const [availabilityError, setAvailabilityError] = useState("");
    const [updatingAvailability, setUpdatingAvailability] = useState(false);
    const filteredJobs = requests.filter((request) => `${shortId(request._id)} ${request.category} ${request.title} ${request.resident?.fullName || ""} ${request.unitNumber}`.toLowerCase().includes(search.toLowerCase())).map((request) => ({
        ...request, id: shortId(request._id), resident: request.resident?.fullName || "Resident unavailable", unit: request.unitNumber, date: dateLabel(request.createdAt),
    }));
    const selectMenu = (menu: string) => {
        setActiveMenu(menu);
        document.getElementById(menu === "Notifications" ? "request-updates" : "assigned-jobs")?.scrollIntoView({ behavior: "smooth" });
    };
    const updateAvailability = async () => {
        if (updatingAvailability) return;
        setUpdatingAvailability(true);
        setAvailabilityError("");
        try {
            const { data } = await api.patch("/auth/me", { available: !available });
            setAvailable(data.user.available);
        } catch (error) { setAvailabilityError(apiError(error)); }
        finally { setUpdatingAvailability(false); }
    };

    return (

        <div className="technician-dashboard">
            {selectedRequest && <RequestEditor user={user} request={selectedRequest} onClose={() => setSelectedRequest(null)} onSaved={() => reload()} />}

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="tech-sidebar">

                <div className="tech-logo">
                    <img
                        src="/livoralogo.png"
                        alt="Livora"
                    />
                </div>

                <div className="tech-profile">

                    <div className="tech-avatar">{initials(user.fullName)}</div>

                    <div>
                        <h3>{user.fullName}</h3>

                        <p>{user.speciality || "Maintenance"} Technician</p>
                    </div>

                </div>


                {/* NAVIGATION */}

                <nav className="tech-nav">

                    <button className={`tech-nav-item ${activeMenu === "Dashboard" ? "active" : ""}`} onClick={() => selectMenu("Dashboard")}>

                        <span>⌂</span>

                        Dashboard

                    </button>


                    <button className={`tech-nav-item ${activeMenu === "My Jobs" ? "active" : ""}`} onClick={() => selectMenu("My Jobs")}>

                        <span>🔧</span>

                        My Jobs

                    </button>


                    <button className={`tech-nav-item ${activeMenu === "Calendar" ? "active" : ""}`} onClick={() => selectMenu("Calendar")}>

                        <span>📅</span>

                        Calendar

                    </button>


                    <button className={`tech-nav-item ${activeMenu === "Notifications" ? "active" : ""}`} onClick={() => selectMenu("Notifications")}>

                        <span>🔔</span>

                        Notifications

                        <b className="notification-count">
                            {requests.length}
                        </b>

                    </button>


                    <button className={`tech-nav-item ${activeMenu === "Profile" ? "active" : ""}`} onClick={() => selectMenu("Profile")}>

                        <span>👤</span>

                        Profile

                    </button>

                </nav>


                <div className="tech-sidebar-bottom">

                    <button
                        className="tech-home-btn"
                        onClick={() => navigate("/")}
                    >
                        ← Back to Home
                    </button>

                    <button
                        className="tech-logout-btn"
                        onClick={logout}
                    >
                        ⇥ Logout
                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="tech-main">


                {/* =================================================
                    TOP BAR
                ================================================= */}

                <header className="tech-topbar">

                    <div className="tech-search">

                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search jobs, residents..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>


                    <div className="tech-top-right">

                        <div className="tech-notification">

                            🔔

                            <span>{requests.length}</span>

                        </div>


                        <div className="tech-user">

                            <div className="tech-user-avatar">{initials(user.fullName)}</div>

                            <div>

                                <strong>
                                    {user.fullName}
                                </strong>

                                <small>
                                    {user.speciality || "Maintenance"} Technician
                                </small>

                            </div>

                            <span className="dropdown-arrow">
                                ▾
                            </span>

                        </div>

                    </div>

                </header>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="tech-content">
                    {loading && <p role="status">Loading assigned requests…</p>}
                    {error && <div className="integration-panel" role="alert">{error}<button onClick={() => void reload()}>Retry</button></div>}
                    {availabilityError && <p role="alert">{availabilityError}</p>}
                    {!loading && !error && !requests.length && <p>No jobs assigned yet.</p>}
                    {activeMenu === "Profile" && <section className="integration-panel"><h2>Profile</h2><p>{user.fullName}<br />{user.email}<br />{user.speciality}<br />Availability: {available ? "Available" : "Unavailable"}</p></section>}
                    {activeMenu === "Calendar" && <section className="integration-panel"><h2>Job calendar</h2><p>Assigned request dates</p>{requests.map((request) => <p key={request._id}>{dateLabel(request.createdAt)} — {request.title} · {request.status}</p>)}</section>}


                    {/* =================================================
                        HERO
                    ================================================= */}

                    <section className="tech-hero">

                        <div className="tech-hero-overlay"></div>

                        <div className="tech-hero-content">

                            <span className="tech-welcome">
                                WELCOME BACK
                            </span>

                            <h1>
                                Keep maintenance
                                <br />
                                running smoothly 🔧
                            </h1>

                            <p>
                                Manage your assigned maintenance
                                jobs and keep apartment services
                                running efficiently.
                            </p>

                            <button
                                onClick={() => {
                                    document
                                        .getElementById("assigned-jobs")
                                        ?.scrollIntoView({
                                            behavior: "smooth"
                                        });
                                }}
                            >
                                🔧 View My Jobs
                            </button>

                        </div>

                    </section>


                    {/* =================================================
                        STAT CARDS
                    ================================================= */}

                    <section className="tech-stats">


                        {/* ASSIGNED */}

                        <div className="tech-stat-card blue">

                            <div className="tech-stat-icon">
                                📋
                            </div>

                            <div className="tech-stat-info">

                                <span>
                                    Assigned Jobs
                                </span>

                                <strong>
                                    {requests.length}
                                </strong>

                                <small>
                                    All assigned requests
                                </small>

                            </div>

                            <div className="mini-chart blue-chart">
                                <svg width="90" height="45" viewBox="0 0 100 50" aria-label="Requests created in the last seven days"><polyline points={trendPoints(requests)} fill="none" stroke="currentColor" strokeWidth="3" /></svg>
                            </div>

                        </div>


                        {/* PENDING */}

                        <div className="tech-stat-card yellow">

                            <div className="tech-stat-icon">
                                ⏳
                            </div>

                            <div className="tech-stat-info">

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

                            <div className="mini-chart yellow-chart">
                                <svg width="90" height="45" viewBox="0 0 100 50" aria-label="Requests created in the last seven days"><polyline points={trendPoints(requests, "Pending")} fill="none" stroke="currentColor" strokeWidth="3" /></svg>
                            </div>

                        </div>


                        {/* IN PROGRESS */}

                        <div className="tech-stat-card purple">

                            <div className="tech-stat-icon">
                                🔧
                            </div>

                            <div className="tech-stat-info">

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

                            <div className="mini-chart purple-chart">
                                <svg width="90" height="45" viewBox="0 0 100 50" aria-label="Requests created in the last seven days"><polyline points={trendPoints(requests, "In Progress")} fill="none" stroke="currentColor" strokeWidth="3" /></svg>
                            </div>

                        </div>


                        {/* COMPLETED */}

                        <div className="tech-stat-card green">

                            <div className="tech-stat-icon">
                                ✓
                            </div>

                            <div className="tech-stat-info">

                                <span>
                                    Completed
                                </span>

                                <strong>
                                    {completed}
                                </strong>

                                <small>
                                    Completed requests
                                </small>

                            </div>

                            <div className="mini-chart green-chart">
                                <svg width="90" height="45" viewBox="0 0 100 50" aria-label="Requests created in the last seven days"><polyline points={trendPoints(requests, "Completed")} fill="none" stroke="currentColor" strokeWidth="3" /></svg>
                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        LOWER SECTION
                    ================================================= */}

                    <section className="tech-lower-grid">


                        {/* =================================================
                            ASSIGNED JOBS
                        ================================================= */}

                        <div
                            className="assigned-jobs-card"
                            id="assigned-jobs"
                        >

                            <div className="section-heading">

                                <div>

                                    <h2>
                                        🔧 My Assigned Jobs
                                    </h2>

                                    <p>
                                        Maintenance jobs assigned
                                        to you
                                    </p>

                                </div>

                                <button className="view-all-btn" onClick={() => selectMenu("My Jobs")}>
                                    View All →
                                </button>

                            </div>


                            <div className="jobs-table-wrapper">

                                <table className="jobs-table">

                                    <thead>

                                        <tr>

                                            <th>ID</th>

                                            <th>
                                                Job Details
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

                                        {filteredJobs.map((job) => (

                                            <tr key={job.id}>

                                                <td>
                                                    <strong>
                                                        {job.id}
                                                    </strong>
                                                </td>


                                                <td>

                                                    <div className="job-detail">

                                                        <div className="job-icon">
                                                            {job.category === "Electrical"
                                                                ? "💡"
                                                                : job.category === "Plumbing"
                                                                ? "🔧"
                                                                : "🛠️"}
                                                        </div>

                                                        <div>

                                                            <strong>
                                                                {job.title}
                                                            </strong>

                                                            <small>
                                                                {job.description}
                                                            </small>

                                                        </div>

                                                    </div>

                                                </td>


                                                <td>
                                                    {job.resident}
                                                </td>


                                                <td>
                                                    {job.unit}
                                                </td>


                                                <td>

                                                    <span
                                                        className={
                                                            `priority ${job.priority.toLowerCase()}`
                                                        }
                                                    >
                                                        {job.priority}
                                                    </span>

                                                </td>


                                                <td>

                                                    <span
                                                        className={
                                                            `job-status ${job.status
                                                                .toLowerCase()
                                                                .replace(" ", "-")}`
                                                        }
                                                    >
                                                        {job.status}
                                                    </span>

                                                </td>


                                                <td>
                                                    {job.date}
                                                </td>


                                                <td>

                                                    <button className="view-job-btn" onClick={() => setSelectedRequest(requests.find((item) => item._id === job._id) || null)}>
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
                            RIGHT SIDE
                        ================================================= */}

                        <div className="tech-right-column">


                            {/* QUICK ACTIONS */}

                            <div className="tech-side-card">

                                <h2>
                                    ⚡ Quick Actions
                                </h2>


                                <button className="quick-action" onClick={() => selectMenu("My Jobs")}>

                                    <span className="quick-icon blue-bg">
                                        🔧
                                    </span>

                                    <span>
                                        View My Jobs
                                    </span>

                                    <b>
                                        ›
                                    </b>

                                </button>


                                <button className="quick-action" onClick={() => selectMenu("Calendar")}>

                                    <span className="quick-icon purple-bg">
                                        📅
                                    </span>

                                    <span>
                                        My Calendar
                                    </span>

                                    <b>
                                        ›
                                    </b>

                                </button>


                                <button className="quick-action" onClick={() => void updateAvailability()}>

                                    <span className="quick-icon green-bg">
                                        ✓
                                    </span>

                                    <span>
                                        {available ? "Set Unavailable" : "Set Available"}
                                    </span>

                                    <b>
                                        ›
                                    </b>

                                </button>


                                <button className="quick-action" onClick={() => selectMenu("Notifications")}>

                                    <span className="quick-icon orange-bg">
                                        🔔
                                    </span>

                                    <span>
                                        Notifications
                                    </span>

                                    <b className="quick-notification">
                                        {requests.length}
                                    </b>

                                </button>

                            </div>


                            {/* NOTIFICATIONS */}

                            <div className="tech-side-card">

                                <div className="side-title-row">

                                    <h2>
                                        🔔 Recent Notifications
                                    </h2>

                                    <a href="#request-updates">
                                        View All
                                    </a>

                                </div>


                                <RequestUpdates requests={requests} />

                            </div>


                            {/* COMPLETION */}

                            <div className="completion-card">

                                <h2>
                                    📊 Job Completion Rate
                                </h2>

                                <div className="completion-content">

                                    <div className="completion-circle" style={{ background: `conic-gradient(#20d9c5 ${completionRate}%, #e8edf2 0)` }}>

                                        <div>
                                            <strong>
                                                {completionRate}%
                                            </strong>

                                            <span>
                                                Completed
                                            </span>
                                        </div>

                                    </div>


                                    <div className="completion-details">

                                        <p>
                                            <span className="dot green-dot"></span>
                                            Completed
                                            <strong>{completed}</strong>
                                        </p>

                                        <p>
                                            <span className="dot purple-dot"></span>
                                            In Progress
                                            <strong>{active}</strong>
                                        </p>

                                        <p>
                                            <span className="dot yellow-dot"></span>
                                            Pending
                                            <strong>{pending}</strong>
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}

export default TechnicianDashboard;
