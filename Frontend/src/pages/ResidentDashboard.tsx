import { useState } from "react";
import { Link } from "react-router-dom";
import { useDashboard, shortId, dateLabel, trendPoints } from "../useDashboard";
import type { MaintenanceRequest } from "../useDashboard";
import RequestEditor from "../components/RequestEditor";
import RequestUpdates from "../components/RequestUpdates";
import "../styles/Dashboard.css";

function ResidentDashboard() {
    const [activeMenu, setActiveMenu] = useState("Dashboard");
    const { user, requests: rawRequests, loading, error, reload, pending, active, completed, completionRate, logout } = useDashboard();
    const [search, setSearch] = useState("");
    const [createOpen, setCreateOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
    const requests = rawRequests.filter((request) => `${request.title} ${request.description} ${request.status}`.toLowerCase().includes(search.toLowerCase())).map((request) => ({
        ...request, id: shortId(request._id), icon: request.category === "Electrical" ? "💡" : "🔧", date: dateLabel(request.createdAt),
    }));

    const handleMenuClick = (menu: string) => {
        setActiveMenu(menu);
        if (menu === "Create Request") setCreateOpen(true);
        else document.getElementById(menu === "Notifications" ? "request-updates" : "resident-requests")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="resident-dashboard">
            {(createOpen || selectedRequest) && <RequestEditor user={user} request={selectedRequest || undefined} onClose={() => { setCreateOpen(false); setSelectedRequest(null); }} onSaved={() => reload()} />}

            {/* ================= SIDEBAR ================= */}

            <aside className="dashboard-sidebar">

                <div className="sidebar-logo">
                    <img
                        src="/livoralogo.png"
                        alt="Livora"
                    />
                </div>

                <div className="sidebar-divider"></div>

                {/* USER PROFILE */}

                <div className="sidebar-profile">

                    <div className="profile-avatar">
                        👤
                    </div>

                    <div className="profile-info">
                        <h3>{user.fullName}</h3>
                        <p>Resident</p>
                        <span>Apartment {user.unitNumber || "not set"}</span>
                    </div>

                </div>

                {/* SIDEBAR MENU */}

                <nav className="sidebar-menu">

                    <button
                        className={`menu-item ${
                            activeMenu === "Dashboard" ? "active" : ""
                        }`}
                        onClick={() => handleMenuClick("Dashboard")}
                    >
                        <span className="menu-icon">⌂</span>
                        <span>Dashboard</span>
                    </button>

                    <button
                        className={`menu-item ${
                            activeMenu === "Create Request" ? "active" : ""
                        }`}
                        onClick={() => handleMenuClick("Create Request")}
                    >
                        <span className="menu-icon">＋</span>
                        <span>Create Request</span>
                    </button>

                    <button
                        className={`menu-item ${
                            activeMenu === "My Requests" ? "active" : ""
                        }`}
                        onClick={() => handleMenuClick("My Requests")}
                    >
                        <span className="menu-icon">▤</span>
                        <span>My Requests</span>
                    </button>

                    <button
                        className={`menu-item ${
                            activeMenu === "Request Tracking" ? "active" : ""
                        }`}
                        onClick={() => handleMenuClick("Request Tracking")}
                    >
                        <span className="menu-icon">◉</span>
                        <span>Request Tracking</span>
                    </button>

                    <button
                        className={`menu-item ${
                            activeMenu === "Notifications" ? "active" : ""
                        }`}
                        onClick={() => handleMenuClick("Notifications")}
                    >
                        <span className="menu-icon">♟</span>
                        <span>Notifications</span>

                        <span className="notification-badge">
                            {rawRequests.length}
                        </span>
                    </button>

                    <button
                        className={`menu-item ${
                            activeMenu === "Profile" ? "active" : ""
                        }`}
                        onClick={() => handleMenuClick("Profile")}
                    >
                        <span className="menu-icon">●</span>
                        <span>Profile</span>
                    </button>

                </nav>

                {/* SIDEBAR BOTTOM */}

                <div className="sidebar-bottom">

                    <Link
                        to="/"
                        className="back-home"
                    >
                        ← Back to Home
                    </Link>

                    <Link
                        to="/login"
                        className="logout-link"
                        onClick={logout}
                    >
                        Logout
                    </Link>

                </div>

            </aside>


            {/* ================= MAIN CONTENT ================= */}

            <main className="dashboard-main">

                {/* TOP BAR */}

                <header className="dashboard-topbar">

                    <div className="search-box">

                        <span className="search-icon">
                            ⌕
                        </span>

                        <input
                            type="text"
                            placeholder="Search requests, notifications..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                    </div>


                    <div className="topbar-right">

                        <div className="notification-top">

                            <span className="bell">
                                🔔
                            </span>

                            <span className="notification-count">
                                {rawRequests.length}
                            </span>

                        </div>


                        <div className="top-profile">

                            <div className="top-avatar">
                                👤
                            </div>

                            <div>

                                <strong>
                                    {user.fullName}
                                </strong>

                                <span>
                                    Apartment {user.unitNumber || "not set"}
                                </span>

                            </div>

                            <span className="profile-arrow">
                                ▼
                            </span>

                        </div>

                    </div>

                </header>


                {/* ================= CONTENT ================= */}

                <section className="dashboard-content">
                    {loading && <p role="status">Loading requests…</p>}
                    {error && <div role="alert" className="integration-panel">{error}<button onClick={() => void reload()}>Retry</button></div>}
                    {!loading && !error && !rawRequests.length && <p>No maintenance requests yet. Create your first request.</p>}
                    {activeMenu === "Profile" && <section className="integration-panel"><h2>Profile</h2><p>{user.fullName}<br />{user.email}<br />Unit: {user.unitNumber || "not set"}</p></section>}


                    {/* ================= HERO BANNER ================= */}

                    <div className="dashboard-hero">

                        <div className="hero-overlay"></div>

                        <div className="dashboard-hero-content">

                            <span className="welcome-label">
                                WELCOME BACK
                            </span>

                            <h1>
                                Keep your home comfortable 🏠
                            </h1>

                            <p>
                                Report maintenance problems and track
                                your requests from one place.
                            </p>

                            <button
                                className="create-request-btn"
                                onClick={() =>
                                    handleMenuClick("Create Request")
                                }
                            >
                                ＋ Create New Request
                            </button>

                        </div>


                        <div className="hero-message">
                            Better<br />
                            Living<br />
                            Together
                        </div>

                    </div>


                    {/* ================= STAT CARDS ================= */}

                    <div className="stat-grid">


                        {/* TOTAL */}

                        <div className="stat-card total-card">

                            <div className="stat-icon">
                                📄
                            </div>

                            <div className="stat-information">

                                <span>
                                    Total Requests
                                </span>

                                <strong>
                                    {rawRequests.length}
                                </strong>

                                <small>
                                    All your requests
                                </small>

                            </div>

                            <div className="mini-chart blue-chart">
                                <svg
                                    viewBox="0 0 100 50"
                                    preserveAspectRatio="none"
                                >
                                    <polyline
                                        points={trendPoints(rawRequests)}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>

                        </div>


                        {/* PENDING */}

                        <div className="stat-card pending-card">

                            <div className="stat-icon">
                                ⏳
                            </div>

                            <div className="stat-information">

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

                            <div className="mini-chart orange-chart">

                                <svg
                                    viewBox="0 0 100 50"
                                    preserveAspectRatio="none"
                                >
                                    <polyline
                                        points={trendPoints(rawRequests, "Pending")}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>

                            </div>

                        </div>


                        {/* IN PROGRESS */}

                        <div className="stat-card progress-card">

                            <div className="stat-icon">
                                🔧
                            </div>

                            <div className="stat-information">

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

                                <svg
                                    viewBox="0 0 100 50"
                                    preserveAspectRatio="none"
                                >
                                    <polyline
                                        points={trendPoints(rawRequests, "In Progress")}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>

                            </div>

                        </div>


                        {/* COMPLETED */}

                        <div className="stat-card completed-card">

                            <div className="stat-icon">
                                ✓
                            </div>

                            <div className="stat-information">

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

                                <svg
                                    viewBox="0 0 100 50"
                                    preserveAspectRatio="none"
                                >
                                    <polyline
                                        points={trendPoints(rawRequests, "Completed")}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>

                            </div>

                        </div>

                    </div>


                    {/* ================= LOWER SECTION ================= */}

                    <div className="dashboard-lower">


                        {/* RECENT REQUESTS */}

                        <section className="requests-section" id="resident-requests">

                            <div className="section-heading">

                                <div>

                                    <h2>
                                        📄 Recent Requests
                                    </h2>

                                    <p>
                                        Your latest maintenance requests
                                    </p>

                                </div>

                                <button className="view-all-btn" onClick={() => handleMenuClick("My Requests")}>
                                    View All →
                                </button>

                            </div>


                            <div className="requests-table">


                                <div className="table-header">

                                    <span>#</span>

                                    <span>
                                        Request Details
                                    </span>

                                    <span>
                                        Priority
                                    </span>

                                    <span>
                                        Status
                                    </span>

                                    <span>
                                        Date
                                    </span>

                                    <span>
                                        Actions
                                    </span>

                                </div>


                                {requests.map((request) => (

                                    <div
                                        className="request-row"
                                        key={request.id}
                                    >

                                        <span className="request-number">
                                            {request.id}
                                        </span>


                                        <div className="request-details">

                                            <div className="request-icon">
                                                {request.icon}
                                            </div>

                                            <div>

                                                <strong>
                                                    {request.title}
                                                </strong>

                                                <p>
                                                    {request.description}
                                                </p>

                                            </div>

                                        </div>


                                        <span
                                            className={`priority ${request.priority.toLowerCase()}`}
                                        >
                                            {request.priority}
                                        </span>


                                        <span
                                            className={`status ${request.status
                                                .toLowerCase()
                                                .replace(" ", "-")}`}
                                        >
                                            {request.status}
                                        </span>


                                        <span className="request-date">
                                            {request.date}
                                        </span>


                                        <button className="view-request" onClick={() => setSelectedRequest(rawRequests.find((item) => item._id === request._id) || null)}>
                                            View
                                        </button>

                                    </div>

                                ))}

                            </div>

                        </section>


                        {/* RIGHT COLUMN */}

                        <aside className="dashboard-right">


                            {/* QUICK ACTIONS */}

                            <div className="side-panel">

                                <div className="side-panel-title">

                                    <span className="title-icon">
                                        ⚡
                                    </span>

                                    <h3>
                                        Quick Actions
                                    </h3>

                                </div>


                                <button className="quick-action" onClick={() => handleMenuClick("Create Request")}>
                                    <span className="quick-icon blue">
                                        ＋
                                    </span>

                                    <span>
                                        Create New Request
                                    </span>

                                    <b>
                                        ›
                                    </b>
                                </button>


                                <button className="quick-action" onClick={() => handleMenuClick("My Requests")}>
                                    <span className="quick-icon purple">
                                        ▤
                                    </span>

                                    <span>
                                        View My Requests
                                    </span>

                                    <b>
                                        ›
                                    </b>
                                </button>


                                <button className="quick-action" onClick={() => handleMenuClick("Request Tracking")}>
                                    <span className="quick-icon green">
                                        ◉
                                    </span>

                                    <span>
                                        Track Request
                                    </span>

                                    <b>
                                        ›
                                    </b>
                                </button>


                                <button className="quick-action" onClick={() => handleMenuClick("Notifications")}>
                                    <span className="quick-icon orange">
                                        🔔
                                    </span>

                                    <span>
                                        Notifications
                                    </span>

                                    <em>
                                        {rawRequests.length}
                                    </em>

                                </button>

                            </div>


                            {/* NOTIFICATIONS */}

                            <div className="side-panel notifications-panel">

                                <div className="side-panel-title">

                                    <span className="title-icon orange-title">
                                        🔔
                                    </span>

                                    <h3>
                                        Recent Notifications
                                    </h3>

                                    <a href="#request-updates">
                                        View All
                                    </a>

                                </div>


                                <RequestUpdates requests={rawRequests} />

                            </div>


                            {/* COMPLETION RATE */}

                            <div className="completion-panel">

                                <div className="completion-circle" style={{ background: `conic-gradient(#20d9c5 ${completionRate}%, #e8edf2 0)` }}>

                                    <span>
                                        {completionRate}%
                                    </span>

                                </div>

                                <div>

                                    <strong>
                                        Request Completion Rate
                                    </strong>

                                    <p>
                                        {completed} of {rawRequests.length} requests completed
                                    </p>

                                    <small>
                                        Based on your requests
                                    </small>

                                </div>

                            </div>

                        </aside>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default ResidentDashboard;
