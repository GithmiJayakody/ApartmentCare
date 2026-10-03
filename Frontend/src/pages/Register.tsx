import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css";

type Role = "Resident" | "Technician" | "Manager";

function Register() {
    const navigate = useNavigate();

    // Selected role
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    // Form fields
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [apartment, setApartment] = useState("");
    const [speciality, setSpeciality] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");

    // Select role
    const handleRoleSelect = (role: Role) => {
        setSelectedRole(role);
        setError("");

        // Clear role-specific fields
        setApartment("");
        setSpeciality("");
    };

    // Go back to role selection
    const handleBackToRoles = () => {
        setSelectedRole(null);
        setError("");
    };

    // Create account
    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();

        setError("");

        if (!selectedRole) {
            setError("Please select a role.");
            return;
        }

        if (!fullName || !email || !password || !confirmPassword) {
            setError("Please fill in all required fields.");
            return;
        }

        // Apartment is required only for Resident
        if (selectedRole === "Resident" && !apartment) {
            setError("Please enter your apartment / unit number.");
            return;
        }

        // Speciality is required only for Technician
        if (selectedRole === "Technician" && !speciality) {
            setError("Please enter your speciality.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        /*
         * Frontend-only account information.
         * This is temporary because backend is not created yet.
         */
        localStorage.setItem("livoraName", fullName);
        localStorage.setItem("livoraEmail", email);
        localStorage.setItem("livoraRole", selectedRole);

        if (selectedRole === "Resident") {
            localStorage.setItem("livoraApartment", apartment);
        } else {
            localStorage.removeItem("livoraApartment");
        }

        if (selectedRole === "Technician") {
            localStorage.setItem("livoraSpeciality", speciality);
        } else {
            localStorage.removeItem("livoraSpeciality");
        }

        /*
         * After registration:
         * Go to Login and send the selected role.
         *
         * Example:
         * Resident   → Login with Resident selected
         * Technician → Login with Technician selected
         * Manager    → Login with Manager selected
         */
        navigate("/login", {
            state: {
                role: selectedRole
            }
        });
    };

    return (
        <div className="register-page">

            {/* Background overlay */}
            <div className="register-overlay"></div>

            <div className="register-card">

                {/* ================= LOGO ================= */}

                <div className="register-logo-container">

                    <img
                        src="/livoralogo.png"
                        alt="Livora Logo"
                        className="register-logo"
                    />

                </div>


                {/* =================================================
                    ROLE SELECTION PAGE
                ================================================= */}

                {!selectedRole ? (

                    <>

                        <h1>Create Account</h1>

                        <p className="register-subtitle">
                            Choose your role to get started
                        </p>


                        <div className="role-title">
                            Register as
                        </div>


                        {/* ================= RESIDENT ================= */}

                        <button
                            type="button"
                            className="role-card"
                            onClick={() =>
                                handleRoleSelect("Resident")
                            }
                        >

                            <div className="role-card-icon resident-icon">
                                🏠
                            </div>

                            <div className="role-card-content">

                                <h3>
                                    Resident
                                </h3>

                                <p>
                                    Manage your apartment
                                    maintenance requests.
                                </p>

                            </div>

                            <span className="role-card-arrow">
                                →
                            </span>

                        </button>


                        {/* ================= TECHNICIAN ================= */}

                        <button
                            type="button"
                            className="role-card"
                            onClick={() =>
                                handleRoleSelect("Technician")
                            }
                        >

                            <div className="role-card-icon technician-icon">
                                🔧
                            </div>

                            <div className="role-card-content">

                                <h3>
                                    Technician
                                </h3>

                                <p>
                                    Manage assigned maintenance
                                    jobs and tasks.
                                </p>

                            </div>

                            <span className="role-card-arrow">
                                →
                            </span>

                        </button>


                        {/* ================= MANAGER ================= */}

                        <button
                            type="button"
                            className="role-card"
                            onClick={() =>
                                handleRoleSelect("Manager")
                            }
                        >

                            <div className="role-card-icon manager-icon">
                                👨‍💼
                            </div>

                            <div className="role-card-content">

                                <h3>
                                    Manager
                                </h3>

                                <p>
                                    Manage residents, technicians
                                    and maintenance activities.
                                </p>

                            </div>

                            <span className="role-card-arrow">
                                →
                            </span>

                        </button>


                        {/* LOGIN */}

                        <div className="register-login-link">

                            <span>
                                Already have an account?
                            </span>

                            <Link to="/login">
                                Login
                            </Link>

                        </div>


                        {/* BACK HOME */}

                        <button
                            type="button"
                            className="register-home-btn"
                            onClick={() => navigate("/")}
                        >
                            ← Back to Home
                        </button>

                    </>

                ) : (

                    /* =================================================
                       REGISTRATION FORM
                    ================================================= */

                    <>

                        <div className="selected-role-header">

                            <button
                                type="button"
                                className="back-role-btn"
                                onClick={handleBackToRoles}
                            >
                                ← Change Role
                            </button>

                            <div className="selected-role-icon">

                                {selectedRole === "Resident" && "🏠"}

                                {selectedRole === "Technician" && "🔧"}

                                {selectedRole === "Manager" && "👨‍💼"}

                            </div>

                        </div>


                        <h1>
                            Create Account
                        </h1>


                        <p className="register-subtitle">

                            Register as{" "}

                            <strong>
                                {selectedRole}
                            </strong>

                        </p>


                        <form onSubmit={handleRegister}>


                            {/* ================= FULL NAME ================= */}

                            <div className="register-input-group">

                                <label>
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={fullName}
                                    onChange={(e) =>
                                        setFullName(e.target.value)
                                    }
                                />

                            </div>


                            {/* ================= EMAIL ================= */}

                            <div className="register-input-group">

                                <label>
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                />

                            </div>


                            {/* =================================================
                                APARTMENT / UNIT
                                ONLY RESIDENT
                            ================================================= */}

                            {selectedRole === "Resident" && (

                                <div className="register-input-group">

                                    <label>
                                        Apartment / Unit
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Example: A-204"
                                        value={apartment}
                                        onChange={(e) =>
                                            setApartment(e.target.value)
                                        }
                                    />

                                </div>

                            )}


                            {/* =================================================
                                SPECIALITY
                                ONLY TECHNICIAN
                            ================================================= */}

                            {selectedRole === "Technician" && (

                                <div className="register-input-group">

                                    <label>
                                        Speciality
                                    </label>

                                    <select
                                        value={speciality}
                                        onChange={(e) =>
                                            setSpeciality(e.target.value)
                                        }
                                    >

                                        <option value="">
                                            Select your speciality
                                        </option>

                                        <option value="Plumbing">
                                            Plumbing
                                        </option>

                                        <option value="Electrical">
                                            Electrical
                                        </option>

                                        <option value="HVAC">
                                            HVAC
                                        </option>

                                        <option value="Carpentry">
                                            Carpentry
                                        </option>

                                        <option value="General Maintenance">
                                            General Maintenance
                                        </option>

                                    </select>

                                </div>

                            )}


                            {/* ================= PASSWORD ================= */}

                            <div className="register-input-group">

                                <label>
                                    Password
                                </label>

                                <div className="register-password-wrapper">

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Create a password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />

                                    <button
                                        type="button"
                                        className="register-eye"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? "◉" : "◌"}
                                    </button>

                                </div>

                            </div>


                            {/* ================= CONFIRM PASSWORD ================= */}

                            <div className="register-input-group">

                                <label>
                                    Confirm Password
                                </label>

                                <div className="register-password-wrapper">

                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <button
                                        type="button"
                                        className="register-eye"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                    >
                                        {showConfirmPassword
                                            ? "◉"
                                            : "◌"}
                                    </button>

                                </div>

                            </div>


                            {/* ================= ERROR ================= */}

                            {error && (

                                <div className="register-error">
                                    {error}
                                </div>

                            )}


                            {/* ================= CREATE ACCOUNT ================= */}

                            <button
                                type="submit"
                                className="register-submit"
                            >
                                Create Account →
                            </button>

                        </form>


                        {/* LOGIN */}

                        <div className="register-login-link">

                            <span>
                                Already have an account?
                            </span>

                            <Link to="/login">
                                Login
                            </Link>

                        </div>


                        {/* BACK HOME */}

                        <button
                            type="button"
                            className="register-home-btn"
                            onClick={() => navigate("/")}
                        >
                            ← Back to Home
                        </button>

                    </>

                )}

            </div>

        </div>
    );
}

export default Register;