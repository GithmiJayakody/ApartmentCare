import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

interface Request {
    id: string;
    icon: string;
    title: string;
    description: string;
    priority: "High" | "Medium" | "Low";
    status: "In Progress" | "Completed" | "Pending";
    date: string;
}

function ResidentDashboard() {

    const [activeMenu, setActiveMenu] = useState("Dashboard");

    const requests: Request[] = [
        {
            id: "#1001",
            icon: "🔧",
            title: "Plumbing Issue",
            description: "Water leakage in bathroom",
            priority: "High",
            status: "In Progress",
            date: "02 Oct 2025"
        },
        {
            id: "#1002",
            icon: "💡",
            title: "Electrical Issue",
            description: "Bedroom light is not working",
            priority: "Medium",
            status: "Completed",
            date: "28 Sep 2025"
        },
        {
            id: "#1003",
            icon: "❄️",
            title: "Air Conditioning",
            description: "AC needs servicing",
            priority: "Low",
            status: "Pending",
            date: "25 Sep 2025"
        }
    ];

    const handleMenuClick = (menu: string) => {
        setActiveMenu(menu);
    };

    return (
        <div className="resident-dashboard">

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
                        <h3>John Resident</h3>
                        <p>Resident</p>
                        <span>Apartment A-204</span>
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
                            3
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
                        />

                    </div>


                    <div className="topbar-right">

                        <div className="notification-top">

                            <span className="bell">
                                🔔
                            </span>

                            <span className="notification-count">
                                3
                            </span>

                        </div>


                        <div className="top-profile">

                            <div className="top-avatar">
                                👤
                            </div>

                            <div>

                                <strong>
                                    John Resident
                                </strong>

                                <span>
                                    Apartment A-204
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
                                    3
                                </strong>

                                <small>
                                    +1 this month
                                </small>

                            </div>

                            <div className="mini-chart blue-chart">
                                <svg
                                    viewBox="0 0 100 50"
                                    preserveAspectRatio="none"
                                >
                                    <polyline
                                        points="0,40 15,32 28,35 42,20 58,25 70,15 82,18 100,3"
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
                                    1
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
                                        points="0,42 15,40 28,28 40,30 52,20 65,25 78,10 88,15 100,2"
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
                                    1
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
                                        points="0,43 15,40 30,25 45,30 58,18 70,22 82,8 92,12 100,1"
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
                                    1
                                </strong>

                                <small>
                                    This month
                                </small>

                            </div>

                            <div className="mini-chart green-chart">

                                <svg
                                    viewBox="0 0 100 50"
                                    preserveAspectRatio="none"
                                >
                                    <polyline
                                        points="0,42 15,35 28,38 42,27 55,29 68,18 80,21 90,10 100,3"
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

                        <section className="requests-section">

                            <div className="section-heading">

                                <div>

                                    <h2>
                                        📄 Recent Requests
                                    </h2>

                                    <p>
                                        Your latest maintenance requests
                                    </p>

                                </div>

                                <button className="view-all-btn">
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


                                        <button className="view-request">
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


                                <button className="quick-action">
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


                                <button className="quick-action">
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


                                <button className="quick-action">
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


                                <button className="quick-action">
                                    <span className="quick-icon orange">
                                        🔔
                                    </span>

                                    <span>
                                        Notifications
                                    </span>

                                    <em>
                                        3
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

                                    <a href="#">
                                        View All
                                    </a>

                                </div>


                                <div className="notification-item">

                                    <div className="notification-circle blue">
                                        ✓
                                    </div>

                                    <div>

                                        <strong>
                                            Request Accepted
                                        </strong>

                                        <p>
                                            Your plumbing request #1001
                                            has been accepted.
                                        </p>

                                    </div>

                                    <time>
                                        2h
                                    </time>

                                </div>


                                <div className="notification-item">

                                    <div className="notification-circle purple">
                                        👤
                                    </div>

                                    <div>

                                        <strong>
                                            Technician Assigned
                                        </strong>

                                        <p>
                                            A technician has been assigned
                                            to your request.
                                        </p>

                                    </div>

                                    <time>
                                        3h
                                    </time>

                                </div>


                                <div className="notification-item">

                                    <div className="notification-circle orange">
                                        !
                                    </div>

                                    <div>

                                        <strong>
                                            Status Update
                                        </strong>

                                        <p>
                                            Your maintenance request is
                                            currently in progress.
                                        </p>

                                    </div>

                                    <time>
                                        4h
                                    </time>

                                </div>


                                <div className="notification-item">

                                    <div className="notification-circle green">
                                        ✓
                                    </div>

                                    <div>

                                        <strong>
                                            Request Completed
                                        </strong>

                                        <p>
                                            Your electrical request #1002
                                            has been completed.
                                        </p>

                                    </div>

                                    <time>
                                        2d
                                    </time>

                                </div>

                            </div>


                            {/* COMPLETION RATE */}

                            <div className="completion-panel">

                                <div className="completion-circle">

                                    <span>
                                        67%
                                    </span>

                                </div>

                                <div>

                                    <strong>
                                        Request Completion Rate
                                    </strong>

                                    <p>
                                        2 of 3 requests completed
                                    </p>

                                    <small>
                                        ↗ +33% from last month
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