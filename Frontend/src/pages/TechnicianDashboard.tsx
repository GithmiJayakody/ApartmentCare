import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TechnicianDashboard.css";

interface Job {
    id: string;
    category: string;
    resident: string;
    unit: string;
    priority: string;
    status: string;
    date: string;
}

function TechnicianDashboard() {

    const navigate = useNavigate();

    const [search, setSearch] = useState("");

    const jobs: Job[] = [
        {
            id: "#1001",
            category: "Plumbing",
            resident: "John Resident",
            unit: "A-204",
            priority: "High",
            status: "Assigned",
            date: "05 Oct 2026"
        },
        {
            id: "#1002",
            category: "Electrical",
            resident: "Sarah Perera",
            unit: "B-102",
            priority: "Medium",
            status: "In Progress",
            date: "06 Oct 2026"
        },
        {
            id: "#1003",
            category: "Maintenance",
            resident: "David Fernando",
            unit: "C-305",
            priority: "High",
            status: "In Progress",
            date: "07 Oct 2026"
        },
        {
            id: "#1004",
            category: "Air Conditioning",
            resident: "Nimal Silva",
            unit: "A-101",
            priority: "Low",
            status: "Completed",
            date: "02 Oct 2026"
        },
        {
            id: "#1005",
            category: "Maintenance",
            resident: "Kasun Perera",
            unit: "B-210",
            priority: "Medium",
            status: "Pending",
            date: "08 Oct 2026"
        }
    ];

    const filteredJobs = jobs.filter((job) =>
        `${job.id} ${job.category} ${job.resident} ${job.unit}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const logout = () => {
        navigate("/login");
    };

    return (

        <div className="technician-dashboard">

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

                    <div className="tech-avatar">
                        MK
                    </div>

                    <div>
                        <h3>Mike Kumar</h3>

                        <p>Electrical Technician</p>
                    </div>

                </div>


                {/* NAVIGATION */}

                <nav className="tech-nav">

                    <button className="tech-nav-item active">

                        <span>⌂</span>

                        Dashboard

                    </button>


                    <button className="tech-nav-item">

                        <span>🔧</span>

                        My Jobs

                    </button>


                    <button className="tech-nav-item">

                        <span>📅</span>

                        Calendar

                    </button>


                    <button className="tech-nav-item">

                        <span>🔔</span>

                        Notifications

                        <b className="notification-count">
                            2
                        </b>

                    </button>


                    <button className="tech-nav-item">

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

                            <span>2</span>

                        </div>


                        <div className="tech-user">

                            <div className="tech-user-avatar">
                                MK
                            </div>

                            <div>

                                <strong>
                                    Mike Kumar
                                </strong>

                                <small>
                                    Electrical Technician
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
                                    5
                                </strong>

                                <small>
                                    +2 this week
                                </small>

                            </div>

                            <div className="mini-chart blue-chart">
                                ╱╲╱╲
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
                                    2
                                </strong>

                                <small>
                                    Needs attention
                                </small>

                            </div>

                            <div className="mini-chart yellow-chart">
                                ╱╲╱╲
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
                                    2
                                </strong>

                                <small>
                                    Being handled
                                </small>

                            </div>

                            <div className="mini-chart purple-chart">
                                ╱╲╱╲
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
                                    3
                                </strong>

                                <small>
                                    This month
                                </small>

                            </div>

                            <div className="mini-chart green-chart">
                                ╱╲╱╲
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

                                <button className="view-all-btn">
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
                                                                {job.category}
                                                            </strong>

                                                            <small>
                                                                Maintenance request
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

                                                    <button className="view-job-btn">
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


                                <button className="quick-action">

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


                                <button className="quick-action">

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


                                <button className="quick-action">

                                    <span className="quick-icon green-bg">
                                        ✓
                                    </span>

                                    <span>
                                        Update Availability
                                    </span>

                                    <b>
                                        ›
                                    </b>

                                </button>


                                <button className="quick-action">

                                    <span className="quick-icon orange-bg">
                                        🔔
                                    </span>

                                    <span>
                                        Notifications
                                    </span>

                                    <b className="quick-notification">
                                        2
                                    </b>

                                </button>

                            </div>


                            {/* NOTIFICATIONS */}

                            <div className="tech-side-card">

                                <div className="side-title-row">

                                    <h2>
                                        🔔 Recent Notifications
                                    </h2>

                                    <a href="#">
                                        View All
                                    </a>

                                </div>


                                <div className="notification-item">

                                    <div className="notification-icon blue-bg">
                                        🔧
                                    </div>

                                    <div>

                                        <strong>
                                            New Job Assigned
                                        </strong>

                                        <p>
                                            Plumbing request #1001
                                            has been assigned to you.
                                        </p>

                                        <small>
                                            2 hours ago
                                        </small>

                                    </div>

                                </div>


                                <div className="notification-item">

                                    <div className="notification-icon purple-bg">
                                        📅
                                    </div>

                                    <div>

                                        <strong>
                                            Job Schedule Updated
                                        </strong>

                                        <p>
                                            Electrical job #1002
                                            is scheduled for tomorrow.
                                        </p>

                                        <small>
                                            4 hours ago
                                        </small>

                                    </div>

                                </div>


                                <div className="notification-item">

                                    <div className="notification-icon orange-bg">
                                        ⚠️
                                    </div>

                                    <div>

                                        <strong>
                                            High Priority Job
                                        </strong>

                                        <p>
                                            Request #1003 requires
                                            immediate attention.
                                        </p>

                                        <small>
                                            Yesterday
                                        </small>

                                    </div>

                                </div>

                            </div>


                            {/* COMPLETION */}

                            <div className="completion-card">

                                <h2>
                                    📊 Job Completion Rate
                                </h2>

                                <div className="completion-content">

                                    <div className="completion-circle">

                                        <div>
                                            <strong>
                                                60%
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
                                            <strong>3</strong>
                                        </p>

                                        <p>
                                            <span className="dot purple-dot"></span>
                                            In Progress
                                            <strong>2</strong>
                                        </p>

                                        <p>
                                            <span className="dot yellow-dot"></span>
                                            Pending
                                            <strong>2</strong>
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