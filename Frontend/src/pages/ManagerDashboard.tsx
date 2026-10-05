import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ManagerDashboard.css";

interface Request {
    id: string;
    category: string;
    resident: string;
    unit: string;
    priority: string;
    status: string;
    date: string;
}

function ManagerDashboard() {

    const navigate = useNavigate();

    const [search, setSearch] = useState("");

    const requests: Request[] = [
        {
            id: "#1001",
            category: "Plumbing Issue",
            resident: "John Resident",
            unit: "A-204",
            priority: "High",
            status: "In Progress",
            date: "05 Oct 2026"
        },
        {
            id: "#1002",
            category: "Electrical Issue",
            resident: "Sarah Perera",
            unit: "B-102",
            priority: "Medium",
            status: "Completed",
            date: "04 Oct 2026"
        },
        {
            id: "#1003",
            category: "Maintenance",
            resident: "David Fernando",
            unit: "C-305",
            priority: "High",
            status: "Pending",
            date: "03 Oct 2026"
        },
        {
            id: "#1004",
            category: "Air Conditioning",
            resident: "Nimal Silva",
            unit: "A-101",
            priority: "Low",
            status: "In Progress",
            date: "02 Oct 2026"
        }
    ];

    const filteredRequests = requests.filter((request) =>
        `${request.id} ${request.category} ${request.resident} ${request.unit}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const logout = () => {
        navigate("/login");
    };

    return (

        <div className="manager-dashboard">

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

                    <div className="manager-avatar">
                        AM
                    </div>

                    <div>

                        <h3>
                            Alex Manager
                        </h3>

                        <p>
                            Apartment Manager
                        </p>

                    </div>

                </div>


                {/* NAVIGATION */}

                <nav className="manager-nav">

                    <button className="manager-nav-item active">

                        <span>⌂</span>

                        Dashboard

                    </button>


                    <button className="manager-nav-item">

                        <span>📋</span>

                        Requests

                        <b className="manager-nav-badge">
                            4
                        </b>

                    </button>


                    <button className="manager-nav-item">

                        <span>👥</span>

                        Residents

                    </button>


                    <button className="manager-nav-item">

                        <span>🔧</span>

                        Technicians

                    </button>


                    <button className="manager-nav-item">

                        <span>🔔</span>

                        Notifications

                        <b className="manager-nav-badge notification">
                            3
                        </b>

                    </button>


                    <button className="manager-nav-item">

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
                                3
                            </span>

                        </div>


                        <div className="manager-user">

                            <div className="manager-user-avatar">
                                AM
                            </div>

                            <div>

                                <strong>
                                    Alex Manager
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
                                    4
                                </strong>

                                <small>
                                    This month
                                </small>

                            </div>

                            <div className="manager-mini-chart">
                                ╱╲╱╲
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
                                    1
                                </strong>

                                <small>
                                    Needs attention
                                </small>

                            </div>

                            <div className="manager-mini-chart">
                                ╱╲╱╲
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
                                    2
                                </strong>

                                <small>
                                    Being handled
                                </small>

                            </div>

                            <div className="manager-mini-chart">
                                ╱╲╱╲
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
                                    1
                                </strong>

                                <small>
                                    This month
                                </small>

                            </div>

                            <div className="manager-mini-chart">
                                ╱╲╱╲
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
                                    120
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
                                    15
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
                                    2.4 Days
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

                                <button>
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
                                                                {request.category}
                                                            </strong>

                                                            <small>
                                                                Maintenance request
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

                                                    <button className="manager-view-btn">
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


                                <button className="manager-action">

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


                                <button className="manager-action">

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


                                <button className="manager-action">

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


                                <button className="manager-action">

                                    <span className="action-icon orange-action">
                                        🔔
                                    </span>

                                    <span>
                                        Notifications
                                    </span>

                                    <b className="manager-action-badge">
                                        3
                                    </b>

                                </button>

                            </div>


                            {/* =================================================
                                TECHNICIAN OVERVIEW
                            ================================================= */}

                            <div className="manager-side-card">

                                <div className="manager-side-title">

                                    <h2>
                                        🔧 Technician Overview
                                    </h2>

                                    <a href="#">
                                        View All
                                    </a>

                                </div>


                                <div className="technician-row">

                                    <div className="technician-avatar">
                                        MK
                                    </div>

                                    <div className="technician-info">

                                        <strong>
                                            Mike Kumar
                                        </strong>

                                        <small>
                                            Electrical Technician
                                        </small>

                                    </div>

                                    <span className="available">
                                        Available
                                    </span>

                                </div>


                                <div className="technician-row">

                                    <div className="technician-avatar">
                                        SP
                                    </div>

                                    <div className="technician-info">

                                        <strong>
                                            Sam Perera
                                        </strong>

                                        <small>
                                            Plumbing Technician
                                        </small>

                                    </div>

                                    <span className="busy">
                                        Busy
                                    </span>

                                </div>


                                <div className="technician-row">

                                    <div className="technician-avatar">
                                        DK
                                    </div>

                                    <div className="technician-info">

                                        <strong>
                                            David Kumar
                                        </strong>

                                        <small>
                                            General Maintenance
                                        </small>

                                    </div>

                                    <span className="available">
                                        Available
                                    </span>

                                </div>

                            </div>


                            {/* =================================================
                                NOTIFICATIONS
                            ================================================= */}

                            <div className="manager-side-card">

                                <h2>
                                    🔔 Recent Notifications
                                </h2>


                                <div className="manager-notification-item">

                                    <div className="notification-icon blue-notification">
                                        📋
                                    </div>

                                    <div>

                                        <strong>
                                            New Request
                                        </strong>

                                        <p>
                                            A new plumbing request
                                            has been submitted.
                                        </p>

                                        <small>
                                            1 hour ago
                                        </small>

                                    </div>

                                </div>


                                <div className="manager-notification-item">

                                    <div className="notification-icon purple-notification">
                                        🔧
                                    </div>

                                    <div>

                                        <strong>
                                            Job Completed
                                        </strong>

                                        <p>
                                            Request #1002 was completed.
                                        </p>

                                        <small>
                                            4 hours ago
                                        </small>

                                    </div>

                                </div>


                                <div className="manager-notification-item">

                                    <div className="notification-icon orange-notification">
                                        ⚠️
                                    </div>

                                    <div>

                                        <strong>
                                            High Priority
                                        </strong>

                                        <p>
                                            Request #1003 requires attention.
                                        </p>

                                        <small>
                                            Yesterday
                                        </small>

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

export default ManagerDashboard;