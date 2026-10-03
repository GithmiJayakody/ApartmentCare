import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

interface Job {
    id: number;
    category: string;
    resident: string;
    unit: string;
    problem: string;
    priority: string;
    status: string;
}

function TechnicianDashboard() {

    const [activePage, setActivePage] = useState("dashboard");

    const [availability, setAvailability] = useState("Available");

    const [jobs, setJobs] = useState<Job[]>([
        {
            id: 1001,
            category: "Plumbing",
            resident: "John Doe",
            unit: "A-204",
            problem: "Water leakage in bathroom",
            priority: "High",
            status: "Assigned",
        },
        {
            id: 1004,
            category: "Electrical",
            resident: "Sarah Smith",
            unit: "B-102",
            problem: "Bedroom light not working",
            priority: "Medium",
            status: "In Progress",
        },
        {
            id: 1005,
            category: "Maintenance",
            resident: "David Perera",
            unit: "C-305",
            problem: "Door lock repair",
            priority: "Low",
            status: "Completed",
        },
    ]);

    const updateStatus = (id: number, status: string) => {

        setJobs(
            jobs.map((job) =>
                job.id === id
                    ? { ...job, status }
                    : job
            )
        );
    };

    const assignedJobs = jobs.filter(
        (job) => job.status === "Assigned"
    ).length;

    const pendingJobs = jobs.filter(
        (job) => job.status === "Accepted"
    ).length;

    const inProgressJobs = jobs.filter(
        (job) => job.status === "In Progress"
    ).length;

    const completedJobs = jobs.filter(
        (job) => job.status === "Completed"
    ).length;

    return (

        <div className="dashboard-page">

            {/* SIDEBAR */}

            <aside className="dashboard-sidebar">

                <div className="dashboard-logo">
                    <img src="/livoralogo.png" />
                </div>

                <div className="user-role">
                    🔧
                    <span>Technician</span>
                </div>

                <nav className="dashboard-menu">

                    <button
                        className={activePage === "dashboard" ? "active" : ""}
                        onClick={() => setActivePage("dashboard")}
                    >
                        📊 Dashboard
                    </button>

                    <button
                        className={activePage === "jobs" ? "active" : ""}
                        onClick={() => setActivePage("jobs")}
                    >
                        🔧 My Assigned Jobs
                    </button>

                    <button
                        className={activePage === "availability" ? "active" : ""}
                        onClick={() => setActivePage("availability")}
                    >
                        🟢 Availability
                    </button>

                    <button
                        className={activePage === "notifications" ? "active" : ""}
                        onClick={() => setActivePage("notifications")}
                    >
                        🔔 Notifications
                    </button>

                    <button
                        className={activePage === "profile" ? "active" : ""}
                        onClick={() => setActivePage("profile")}
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
                        <h1>Technician Dashboard</h1>
                        <p>Manage your assigned maintenance jobs.</p>
                    </div>

                    <div className="header-profile">

                        <div className="profile-avatar">
                            MK
                        </div>

                        <div>
                            <strong>Mike Kumar</strong>
                            <span>Electrical Technician</span>
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
                                    <h2>{assignedJobs}</h2>
                                    <p>Assigned Jobs</p>
                                </div>
                            </div>

                            <div className="dashboard-stat orange">
                                <span>⏳</span>
                                <div>
                                    <h2>{pendingJobs}</h2>
                                    <p>Pending Jobs</p>
                                </div>
                            </div>

                            <div className="dashboard-stat purple">
                                <span>🔧</span>
                                <div>
                                    <h2>{inProgressJobs}</h2>
                                    <p>Jobs In Progress</p>
                                </div>
                            </div>

                            <div className="dashboard-stat green">
                                <span>✓</span>
                                <div>
                                    <h2>{completedJobs}</h2>
                                    <p>Completed Jobs</p>
                                </div>
                            </div>

                        </section>


                        <section className="dashboard-panel large-panel">

                            <div className="panel-header">

                                <div>
                                    <h2>My Assigned Jobs</h2>
                                    <p>Maintenance requests assigned to you.</p>
                                </div>

                                <button
                                    onClick={() => setActivePage("jobs")}
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
                                            <th>Unit</th>
                                            <th>Priority</th>
                                            <th>Status</th>
                                        </tr>

                                    </thead>

                                    <tbody>

                                        {jobs.map((job) => (

                                            <tr key={job.id}>

                                                <td>#{job.id}</td>

                                                <td>{job.category}</td>

                                                <td>{job.resident}</td>

                                                <td>{job.unit}</td>

                                                <td>
                                                    <span className="priority">
                                                        {job.priority}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span
                                                        className={`status ${job.status
                                                            .toLowerCase()
                                                            .replace(" ", "-")}`}
                                                    >
                                                        {job.status}
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


                {/* JOBS */}

                {activePage === "jobs" && (

                    <section className="dashboard-panel large-panel">

                        <div className="panel-header">

                            <div>
                                <h2>My Assigned Jobs</h2>
                                <p>View and update your maintenance jobs.</p>
                            </div>

                        </div>


                        <div className="job-cards">

                            {jobs.map((job) => (

                                <div className="job-card" key={job.id}>

                                    <div className="job-card-header">

                                        <div>
                                            <span className="job-id">
                                                #{job.id}
                                            </span>

                                            <h3>
                                                {job.category}
                                            </h3>
                                        </div>

                                        <span className="priority">
                                            {job.priority}
                                        </span>

                                    </div>


                                    <p>
                                        <strong>Resident:</strong>{" "}
                                        {job.resident}
                                    </p>

                                    <p>
                                        <strong>Unit:</strong>{" "}
                                        {job.unit}
                                    </p>

                                    <p>
                                        <strong>Problem:</strong>{" "}
                                        {job.problem}
                                    </p>


                                    <div className="job-status-control">

                                        <label>Update Status</label>

                                        <select
                                            value={job.status}
                                            onChange={(e) =>
                                                updateStatus(
                                                    job.id,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option>Assigned</option>
                                            <option>Accepted</option>
                                            <option>In Progress</option>
                                            <option>Completed</option>
                                        </select>

                                    </div>


                                    <div className="work-details">

                                        <h4>Add Work Details</h4>

                                        <textarea
                                            placeholder="Work performed, materials used, notes..."
                                        />

                                        <button className="primary-dashboard-btn">
                                            Save Work Details
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </section>
                )}


                {/* AVAILABILITY */}

                {activePage === "availability" && (

                    <section className="dashboard-panel availability-panel">

                        <h2>Update Availability</h2>

                        <p>
                            Let managers know when you are available for jobs.
                        </p>

                        <div className="availability-options">

                            <button
                                className={
                                    availability === "Available"
                                        ? "availability active available"
                                        : "availability available"
                                }
                                onClick={() =>
                                    setAvailability("Available")
                                }
                            >
                                🟢 Available
                            </button>

                            <button
                                className={
                                    availability === "Busy"
                                        ? "availability active busy"
                                        : "availability busy"
                                }
                                onClick={() =>
                                    setAvailability("Busy")
                                }
                            >
                                🟠 Busy
                            </button>

                            <button
                                className={
                                    availability === "Unavailable"
                                        ? "availability active unavailable"
                                        : "availability unavailable"
                                }
                                onClick={() =>
                                    setAvailability("Unavailable")
                                }
                            >
                                🔴 Unavailable
                            </button>

                        </div>

                        <div className="current-availability">
                            Current status:
                            <strong>{availability}</strong>
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
                                <span>🔧</span>

                                <div>
                                    <strong>New job assigned</strong>
                                    <p>
                                        Job #1001 has been assigned to you.
                                    </p>
                                </div>
                            </div>

                            <div className="notification">
                                <span>⚠️</span>

                                <div>
                                    <strong>Urgent request</strong>
                                    <p>
                                        Request #1006 requires immediate attention.
                                    </p>
                                </div>
                            </div>

                            <div className="notification">
                                <span>🔄</span>

                                <div>
                                    <strong>Job changed</strong>
                                    <p>
                                        Request #1004 details have been updated.
                                    </p>
                                </div>
                            </div>

                        </div>

                    </section>
                )}


                {/* PROFILE */}

                {activePage === "profile" && (

                    <section className="dashboard-panel profile-panel">

                        <h2>Technician Profile</h2>

                        <div className="profile-form">

                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    value="Mike Kumar"
                                    readOnly
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    value="mike@example.com"
                                    readOnly
                                />
                            </div>

                            <div className="form-group">
                                <label>Speciality</label>
                                <input
                                    value="Electrical Maintenance"
                                    readOnly
                                />
                            </div>

                            <div className="form-group">
                                <label>Contact Information</label>
                                <input
                                    value="+94 77 123 4567"
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

export default TechnicianDashboard;