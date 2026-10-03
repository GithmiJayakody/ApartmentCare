import "../styles/Home.css";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="home-page">

            {/* ================= NAVBAR ================= */}

            <nav className="navbar">

                <div className="nav-logo">

                    <Link to="/">

                        <img
                            src="/livoralogo.png"
                            alt="Livora Logo"
                        />

                    </Link>

                </div>


                <div className="nav-links">

                    <a href="#home">
                        Home
                    </a>

                    <a href="#features">
                        Features
                    </a>

                    <a href="#about">
                        About
                    </a>

                    <a href="#contact">
                        Contact
                    </a>

                </div>


                <div className="nav-buttons">

                    <Link to="/login">

                        <button className="login-btn">
                            Login
                        </button>

                    </Link>


                    <Link to="/login">

                        <button className="start-btn">
                            Get Started →
                        </button>

                    </Link>

                </div>

            </nav>


            {/* ================= HERO ================= */}

            <section
                className="hero"
                id="home"
            >

                <div className="hero-content">

                    <h1>

                        More than a home,

                        <br />

                        a <span>better living</span> experience

                    </h1>


                    <p>

                        Manage your apartment maintenance, communicate
                        with your community, and make your living easier
                        with Livora.

                    </p>


                    <div className="hero-buttons">

                        {/* Get Started → Login */}

                        <Link to="/login">

                            <button className="primary">
                                Get Started →
                            </button>

                        </Link>


                        {/* Learn More → Features */}

                        <a href="#features">

                            <button className="secondary">
                                ▶ Learn More
                            </button>

                        </a>

                    </div>

                </div>

            </section>


            {/* ================= FEATURES ================= */}

            <section
                className="features"
                id="features"
            >


                {/* ================= RESIDENT ================= */}

                <Link
                    to="/login?role=resident"
                    className="feature-link"
                >

                    <div className="feature-card">

                        <div className="icon">
                            🏠
                        </div>


                        <h3>
                            For Residents
                        </h3>


                        <p>
                            Submit maintenance requests and track
                            their status easily.
                        </p>


                        <span className="arrow">
                            →
                        </span>

                    </div>

                </Link>


                {/* ================= TECHNICIAN ================= */}

                <Link
                    to="/login?role=technician"
                    className="feature-link"
                >

                    <div className="feature-card">

                        <div className="icon">
                            🔧
                        </div>


                        <h3>
                            For Technicians
                        </h3>


                        <p>
                            View assigned tasks, update progress
                            and manage your work.
                        </p>


                        <span className="arrow">
                            →
                        </span>

                    </div>

                </Link>


                {/* ================= MANAGER ================= */}

                <Link
                    to="/login?role=manager"
                    className="feature-link"
                >

                    <div className="feature-card">

                        <div className="icon">
                            👥
                        </div>


                        <h3>
                            For Managers
                        </h3>


                        <p>
                            Manage residents, assign technicians
                            and monitor activities.
                        </p>


                        <span className="arrow">
                            →
                        </span>

                    </div>

                </Link>

            </section>


            {/* ================= ABOUT ================= */}

            <section
                className="about"
                id="about"
            >

                <div className="about-text">

                    <small>
                        ABOUT LIVORA
                    </small>


                    <h2>

                        Building better

                        <br />

                        communities together

                    </h2>


                    <p>

                        Livora is a modern apartment maintenance
                        management system designed to simplify
                        communication between residents, maintenance
                        staff and managers.

                    </p>


                    <p>

                        Our goal is to create a cleaner, safer and
                        more comfortable living environment for everyone.

                    </p>

                </div>


                {/* ================= STATS ================= */}

                <div className="stats">


                    <div className="stat-box">

                        <h2>
                            500+
                        </h2>

                        <p>
                            Happy Residents
                        </p>

                    </div>


                    <div className="stat-box">

                        <h2>
                            1200+
                        </h2>

                        <p>
                            Maintenance Tasks
                        </p>

                    </div>


                    <div className="stat-box">

                        <h2>
                            15+
                        </h2>

                        <p>
                            Apartment Complexes
                        </p>

                    </div>


                    <div className="stat-box">

                        <h2>
                            98%
                        </h2>

                        <p>
                            Satisfaction Rate
                        </p>

                    </div>

                </div>

            </section>


            {/* ================= ROOM GALLERY ================= */}

            <section className="room-gallery">


                <div className="room-card">

                    <img
                        src="/livingroom.png"
                        alt="Living Room"
                    />

                    <h3>
                        Living Room
                    </h3>

                </div>


                <div className="room-card">

                    <img
                        src="/bedroom.png"
                        alt="Bedroom"
                    />

                    <h3>
                        Bedroom
                    </h3>

                </div>


                <div className="room-card">

                    <img
                        src="/kitchen.png"
                        alt="Kitchen"
                    />

                    <h3>
                        Kitchen
                    </h3>

                </div>


                <div className="room-card">

                    <img
                        src="/washroom.png"
                        alt="Washroom"
                    />

                    <h3>
                        Washroom
                    </h3>

                </div>

            </section>


            {/* ================= CONTACT ================= */}

            <section
                id="contact"
                style={{
                    padding: "80px 8%",
                    textAlign: "center"
                }}
            >

                <small
                    style={{
                        color: "#20d9c5",
                        letterSpacing: "4px",
                        fontWeight: "700"
                    }}
                >
                    CONTACT LIVORA
                </small>


                <h2
                    style={{
                        marginTop: "15px",
                        fontSize: "40px",
                        color: "#10284b"
                    }}
                >
                    Ready to make apartment living easier?
                </h2>


                <p
                    style={{
                        marginTop: "15px",
                        color: "#536174",
                        fontSize: "18px"
                    }}
                >
                    Get started with Livora today.
                </p>


                <Link to="/login">

                    <button
                        className="start-btn"
                        style={{
                            marginTop: "25px"
                        }}
                    >
                        Get Started →
                    </button>

                </Link>

            </section>

        </div>
    );
}

export default Home;