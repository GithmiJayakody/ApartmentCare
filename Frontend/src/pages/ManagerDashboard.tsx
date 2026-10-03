import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

interface MaintenanceRequest {
    id: number;
    category: string;
    resident: string;
    unit: string;
    priority: string;
    technician: string;
    status: string;
}

function ManagerDashboard() {

    const [activePage, setActivePage] = useState("dashboard");

    const [requests, setRequests] = useState<MaintenanceRequest[]>([
        {
            id: 1001,
            category: "Plumbing",
            resident: "John Doe",
            unit: "A-204",
            priority: "High",
            technician: "Mike Kumar",
            status: "In Progress",
        },
        {
            id: 1002,
            category: "Electrical",
            resident: "Sarah Smith",
            unit: "B-102",
            priority: "Medium",
            technician: "David Silva",
            status: "Completed",
        },
        {
            id: 1003,
            category: "Maintenance",
            resident: "David Perera",
            unit: "C-305",
            priority: "Low",
            technician: "Not Assigned",
            status: "Pending",
        },
        {
            id: 1004,
            category: "Air Conditioning",
            resident: "Nimal Fernando",
            unit: "A-105",
            priority: "Urgent",
            technician: "Mike Kumar",
            status: "In Progress",
        },
    ]);

    const technicians = [
        {
            name: "Mike Kumar",
            speciality: "Electrical",
            availability: "Available",
            jobs: 5,
        },
        {
            name: "David Silva",
            speciality: "Plumbing",
            availability: "Busy",
            jobs: 8,
        },
        {
            name: "Kasun Perera",
            speciality: "AC Maintenance",
            availability: "Available",
            jobs: 3,
        },
    ];

    const residents = [
        {
            name: "John Doe",
            unit: "A-204",
            requests: 4,
        },
        {
            name: "Sarah Smith",
            unit: "B-102",
            requests: 2,
        },
        {
            name: "David Perera",
            unit: "C-305",
            requests: 5,
        },
    ];

    const totalRequests = requests.length;

    const pendingRequests = requests.filter(
        (request) => request.status === "Pending"
    ).length;

    const activeRequests = requests.filter(
        (request) => request.status === "In Progress"
    ).length;

    const completedRequests = requests.filter(
        (request) => request.status === "Completed"
    ).length;


    const changePriority = (
        id: number,
        priority: string
    ) => {

        setRequests(
            requests.map((request) =>
                request.id === id
                    ? { ...request, priority }
                    : request
            )
        );
    };


    const assignTechnician = (
        id: number,
        technician: string
    ) => {

        setRequests(
            requests.map((request) =>
                request.id === id
                    ? {
                        ...request,
                        technician,
                        status:
                            technician === "Not Assigned"
                                ? "Pending"
                                : "Assigned",
                    }
                    : request
            )
        );
    };


    return (

        <div className="dashboard-page">

            {/* SIDEBAR */}

            <aside className="dashboard-sidebar">

                <div className="dashboard-logo">
                    <img src="/livoralogo.png" />
                </div>

                <div className="user-role">
                    👨‍💼
                    <span>Manager</span>
                </div>


                <nav className="dashboard-menu">

                    <button
                        className={
                            activePage === "dashboard"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActivePage("dashboard")
                        }
                    >
                        📊 Dashboard
                    </button>


                    <button
                        className={
                            activePage === "requests"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActivePage("requests")
                        }
                    >
                        📋 Maintenance Requests
                    </button>


                    <button
                        className={
                            activePage === "technicians"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActivePage("technicians")
                        }
                    >
                        🔧 Technicians
                    </button>


                    <button
                        className={
                            activePage === "residents"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActivePage("residents")
                        }
                    >
                        🏠 Residents
                    </button>


                    <button
                        className={
                            activePage === "reports"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActivePage("reports")
                        }
                    >
                        📈 Reports & Analytics
                    </button>


                    <button
                        className={
                            activePage === "notifications"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActivePage("notifications")
                        }
                    >
                        🔔 Notifications
                    </button>


                    <button
                        className={
                            activePage === "profile"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActivePage("profile")
                        }
                    >
                        👤 Profile
                    </button>

                </nav>


                <Link
                    to="/"
                    className="dashboard-logout"
                >
                    ← Back to Home
                </Link>

            </aside>


            {/* MAIN */}

            <main className="dashboard-main">

                <header className="dashboard-header">

                    <div>
                        <h1>Manager Dashboard</h1>
                        <p>
                            Monitor and manage apartment maintenance.
                        </p>
                    </div>


                    <div className="header-profile">

                        <div className="profile-avatar">
                            AM
                        </div>

                        <div>
                            <strong>Alex Manager</strong>
                            <span>Apartment Manager</span>
                        </div>

                    </div>

                </header>


                {/* DASHBOARD */}

                {activePage === "dashboard" && (

                    <>

                        <section className="dashboard-stats">

                            <div className="dashboard-stat blue">

                                <span>📋</span>

                                <div>
                                    <h2>{totalRequests}</h2>
                                    <p>Total Requests</p>
                                </div>

                            </div>


                            <div className="dashboard-stat orange">

                                <span>⏳</span>

                                <div>
                                    <h2>{pendingRequests}</h2>
                                    <p>Pending Requests</p>
                                </div>

                            </div>


                            <div className="dashboard-stat purple">

                                <span>🔧</span>

                                <div>
                                    <h2>{activeRequests}</h2>
                                    <p>Active Requests</p>
                                </div>

                            </div>


                            <div className="dashboard-stat green">

                                <span>✓</span>

                                <div>
                                    <h2>{completedRequests}</h2>
                                    <p>Completed</p>
                                </div>

                            </div>

                        </section>


                        <section className="dashboard-stats second-stats">

                            <div className="mini-stat">
                                <span>🏠</span>
                                <div>
                                    <h2>128</h2>
                                    <p>Residents</p>
                                </div>
                            </div>

                            <div className="mini-stat">
                                <span>🔧</span>
                                <div>
                                    <h2>15</h2>
                                    <p>Technicians</p>
                                </div>
                            </div>

                            <div className="mini-stat">
                                <span>⏱️</span>
                                <div>
                                    <h2>2.4 Days</h2>
                                    <p>Average Completion</p>
                                </div>
                            </div>

                        </section>


                        <section className="dashboard-panel large-panel">

                            <div className="panel-header">

                                <div>
                                    <h2>Recent Maintenance Requests</h2>
                                    <p>
                                        Monitor the latest requests.
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        setActivePage("requests")
                                    }
                                >
                                    View All
                                </button>

                            </div>


                            <div className="table-wrapper">

                                <table>

                                    <thead>

                                        <tr>
                                            <th>ID</th>
                                            <th>Category</th>
                                            <th>Resident</th>
                                            <th>Priority</th>
                                            <th>Technician</th>
                                            <th>Status</th>
                                        </tr>

                                    </thead>


                                    <tbody>

                                        {requests.map((request) => (

                                            <tr key={request.id}>

                                                <td>
                                                    #{request.id}
                                                </td>

                                                <td>
                                                    {request.category}
                                                </td>

                                                <td>
                                                    {request.resident}
                                                </td>

                                                <td>
                                                    {request.priority}
                                                </td>

                                                <td>
                                                    {request.technician}
                                                </td>

                                                <td>
                                                    <span
                                                        className={`status ${request.status
                                                            .toLowerCase()
                                                            .replace(" ", "-")}`}
                                                    >
                                                        {request.status}
                                                    </span>
                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </section>

                    </>
                )}


                {/* MAINTENANCE REQUESTS */}

                {activePage === "requests" && (

                    <section className="dashboard-panel large-panel">

                        <div className="panel-header">

                            <div>
                                <h2>Manage Maintenance Requests</h2>
                                <p>
                                    Review, assign and monitor requests.
                                </p>
                            </div>

                        </div>


                        <div className="table-wrapper">

                            <table>

                                <thead>

                                    <tr>
                                        <th>ID</th>
                                        <th>Category</th>
                                        <th>Resident</th>
                                        <th>Unit</th>
                                        <th>Priority</th>
                                        <th>Technician</th>
                                        <th>Status</th>
                                    </tr>

                                </thead>


                                <tbody>

                                    {requests.map((request) => (

                                        <tr key={request.id}>

                                            <td>
                                                #{request.id}
                                            </td>

                                            <td>
                                                {request.category}
                                            </td>

                                            <td>
                                                {request.resident}
                                            </td>

                                            <td>
                                                {request.unit}
                                            </td>

                                            <td>

                                                <select
                                                    value={request.priority}
                                                    onChange={(e) =>
                                                        changePriority(
                                                            request.id,
                                                            e.target.value
                                                        )
                                                    }
                                                >

                                                    <option>
                                                        Low
                                                    </option>

                                                    <option>
                                                        Medium
                                                    </option>

                                                    <option>
                                                        High
                                                    </option>

                                                    <option>
                                                        Urgent
                                                    </option>

                                                </select>

                                            </td>


                                            <td>

                                                <select
                                                    value={request.technician}
                                                    onChange={(e) =>
                                                        assignTechnician(
                                                            request.id,
                                                            e.target.value
                                                        )
                                                    }
                                                >

                                                    <option>
                                                        Not Assigned
                                                    </option>

                                                    {technicians.map(
                                                        (technician) => (
                                                            <option
                                                                key={
                                                                    technician.name
                                                                }
                                                            >
                                                                {
                                                                    technician.name
                                                                }
                                                            </option>
                                                        )
                                                    )}

                                                </select>

                                            </td>


                                            <td>

                                                <span
                                                    className={`status ${request.status
                                                        .toLowerCase()
                                                        .replace(" ", "-")}`}
                                                >
                                                    {request.status}
                                                </span>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </section>
                )}


                {/* TECHNICIANS */}

                {activePage === "technicians" && (

                    <section className="dashboard-panel large-panel">

                        <div className="panel-header">

                            <div>
                                <h2>Manage Technicians</h2>
                                <p>
                                    View technician availability and workload.
                                </p>
                            </div>

                        </div>


                        <div className="people-grid">

                            {technicians.map((technician) => (

                                <div
                                    className="person-card"
                                    key={technician.name}
                                >

                                    <div className="person-avatar">
                                        🔧
                                    </div>

                                    <h3>
                                        {technician.name}
                                    </h3>

                                    <p>
                                        {technician.speciality}
                                    </p>

                                    <span
                                        className={
                                            technician.availability ===
                                                "Available"
                                                ? "availability-badge available"
                                                : "availability-badge busy"
                                        }
                                    >
                                        {technician.availability}
                                    </span>

                                    <div className="workload">
                                        <span>Assigned Jobs</span>
                                        <strong>
                                            {technician.jobs}
                                        </strong>
                                    </div>

                                    <button className="primary-dashboard-btn">
                                        Assign Job
                                    </button>

                                </div>

                            ))}

                        </div>

                    </section>
                )}


                {/* RESIDENTS */}

                {activePage === "residents" && (

                    <section className="dashboard-panel large-panel">

                        <div className="panel-header">

                            <div>
                                <h2>Manage Residents</h2>
                                <p>
                                    View residents and their maintenance requests.
                                </p>
                            </div>

                        </div>


                        <div className="people-grid">

                            {residents.map((resident) => (

                                <div
                                    className="person-card"
                                    key={resident.name}
                                >

                                    <div className="person-avatar">
                                        🏠
                                    </div>

                                    <h3>
                                        {resident.name}
                                    </h3>

                                    <p>
                                        Apartment {resident.unit}
                                    </p>

                                    <div className="workload">

                                        <span>
                                            Maintenance Requests
                                        </span>

                                        <strong>
                                            {resident.requests}
                                        </strong>

                                    </div>

                                    <button className="secondary-dashboard-btn">
                                        View Requests
                                    </button>

                                </div>

                            ))}

                        </div>

                    </section>
                )}


                {/* REPORTS */}

                {activePage === "reports" && (

                    <section className="dashboard-panel large-panel">

                        <div className="panel-header">

                            <div>
                                <h2>Reports & Analytics</h2>
                                <p>
                                    Monitor maintenance performance.
                                </p>
                            </div>

                        </div>


                        <div className="analytics-grid">

                            <div className="analytics-card">
                                <h3>Requests by Category</h3>

                                <div className="progress-row">
                                    <span>Plumbing</span>
                                    <strong>42%</strong>
                                </div>

                                <div className="progress">
                                    <div style={{ width: "42%" }}></div>
                                </div>


                                <div className="progress-row">
                                    <span>Electrical</span>
                                    <strong>28%</strong>
                                </div>

                                <div className="progress">
                                    <div style={{ width: "28%" }}></div>
                                </div>


                                <div className="progress-row">
                                    <span>Maintenance</span>
                                    <strong>30%</strong>
                                </div>

                                <div className="progress">
                                    <div style={{ width: "30%" }}></div>
                                </div>

                            </div>


                            <div className="analytics-card">

                                <h3>Request Status</h3>

                                <div className="analytics-number">
                                    <strong>68%</strong>
                                    <span>Completed</span>
                                </div>

                                <div className="analytics-number">
                                    <strong>22%</strong>
                                    <span>In Progress</span>
                                </div>

                                <div className="analytics-number">
                                    <strong>10%</strong>
                                    <span>Pending</span>
                                </div>

                            </div>


                            <div className="analytics-card">

                                <h3>Technician Workload</h3>

                                <div className="workload-bar">
                                    <span>Mike Kumar</span>
                                    <strong>5 Jobs</strong>
                                </div>

                                <div className="workload-bar">
                                    <span>David Silva</span>
                                    <strong>8 Jobs</strong>
                                </div>

                                <div className="workload-bar">
                                    <span>Kasun Perera</span>
                                    <strong>3 Jobs</strong>
                                </div>

                            </div>


                            <div className="analytics-card">

                                <h3>Average Completion Time</h3>

                                <div className="big-number">
                                    2.4
                                    <span>Days</span>
                                </div>

                                <p>
                                    Average time required to complete a
                                    maintenance request.
                                </p>

                            </div>

                        </div>

                    </section>
                )}


                {/* NOTIFICATIONS */}

                {activePage === "notifications" && (

                    <section className="dashboard-panel large-panel">

                        <div className="panel-header">
                            <h2>Notifications</h2>
                        </div>


                        <div className="notification-list">

                            <div className="notification">
                                <span>🆕</span>
                                <div>
                                    <strong>
                                        New maintenance request
                                    </strong>
                                    <p>
                                        Request #1006 has been submitted.
                                    </p>
                                </div>
                            </div>


                            <div className="notification">
                                <span>⚠️</span>
                                <div>
                                    <strong>
                                        High-priority issue
                                    </strong>
                                    <p>
                                        Request #1004 requires attention.
                                    </p>
                                </div>
                            </div>


                            <div className="notification">
                                <span>⏰</span>
                                <div>
                                    <strong>
                                        Delayed job
                                    </strong>
                                    <p>
                                        Request #1001 has exceeded its expected
                                        completion time.
                                    </p>
                                </div>
                            </div>


                            <div className="notification">
                                <span>✓</span>
                                <div>
                                    <strong>
                                        Job completed
                                    </strong>
                                    <p>
                                        Request #1002 has been completed.
                                    </p>
                                </div>
                            </div>

                        </div>

                    </section>
                )}


                {/* PROFILE */}

                {activePage === "profile" && (

                    <section className="dashboard-panel profile-panel">

                        <h2>Manager Profile</h2>

                        <div className="profile-form">

                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    value="Alex Manager"
                                    readOnly
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    value="manager@livora.com"
                                    readOnly
                                />
                            </div>

                            <div className="form-group">
                                <label>Role</label>
                                <input
                                    value="Apartment Manager"
                                    readOnly
                                />
                            </div>

                            <div className="form-group">
                                <label>Contact Information</label>
                                <input
                                    value="+94 71 234 5678"
                                    readOnly
                                />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    value="password123"
                                    readOnly
                                />
                            </div>

                        </div>

                    </section>
                )}

            </main>

        </div>
    );
}

export default ManagerDashboard;