import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "../styles/Login.css";

function Login() {

    const navigate = useNavigate();

    // Get role from URL
    const [searchParams] = useSearchParams();

    const roleFromUrl = searchParams.get("role");


    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [role, setRole] = useState(
        roleFromUrl === "technician"
            ? "Technician"
            : roleFromUrl === "manager"
                ? "Manager"
                : "Resident"
    );

    const [showPassword, setShowPassword] = useState(false);

    const [rememberMe, setRememberMe] = useState(false);

    const [error, setError] = useState("");


    // Automatically change Login As according to
    // the role selected from the Home page

    useEffect(() => {

        if (roleFromUrl === "resident") {

            setRole("Resident");

        }

        else if (roleFromUrl === "technician") {

            setRole("Technician");

        }

        else if (roleFromUrl === "manager") {

            setRole("Manager");

        }

    }, [roleFromUrl]);


    // ================================
    // LOGIN
    // ================================

    const handleLogin = (e: React.FormEvent) => {

        e.preventDefault();

        setError("");


        // Frontend-only validation

        if (!email || !password) {

            setError(
                "Please enter your email and password."
            );

            return;
        }


        // Save login information

        if (rememberMe) {

            localStorage.setItem(
                "livoraEmail",
                email
            );

            localStorage.setItem(
                "livoraRole",
                role
            );

        }


        // ================================
        // ROLE BASED DASHBOARD
        // ================================

        if (role === "Resident") {

            navigate("/resident-dashboard");

        }

        else if (role === "Technician") {

            navigate("/technician-dashboard");

        }

        else if (role === "Manager") {

            navigate("/manager-dashboard");

        }

    };


    return (

        <div className="login-page">


            {/* ================================
                BACKGROUND OVERLAY
            ================================= */}

            <div className="login-overlay"></div>


            {/* ================================
                LOGIN CARD
            ================================= */}

            <div className="login-card">


                {/* ================================
                    LOGO
                ================================= */}

                <div className="login-logo-container">

                    <img
                        src="/livoralogo.png"
                        alt="Livora Logo"
                        className="login-logo"
                    />

                </div>


                {/* ================================
                    TITLE
                ================================= */}

                <h1>
                    Welcome Back
                </h1>


                <p className="login-subtitle">
                    Login to continue
                </p>


                {/* ================================
                    LOGIN FORM
                ================================= */}

                <form onSubmit={handleLogin}>


                    {/* ================================
                        EMAIL
                    ================================= */}

                    <div className="input-group">

                        <span className="input-icon">
                            ✉
                        </span>


                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                    </div>


                    {/* ================================
                        PASSWORD
                    ================================= */}

                    <div className="input-group">

                        <span className="input-icon">
                            🔒
                        </span>


                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />


                        <button
                            type="button"
                            className="password-eye"
                            onClick={() =>
                                setShowPassword(
                                    !showPassword
                                )
                            }
                        >

                            {showPassword
                                ? "◉"
                                : "◌"
                            }

                        </button>

                    </div>


                    {/* ================================
                        LOGIN AS
                    ================================= */}

                    <div className="role-label">

                        Login as

                    </div>


                    <div className="role-select">


                        <span className="role-icon">
                            ♙
                        </span>


                        <select
                            value={role}
                            onChange={(e) =>
                                setRole(e.target.value)
                            }
                        >

                            <option value="Resident">
                                🏠 Resident
                            </option>


                            <option value="Technician">
                                🔧 Technician
                            </option>


                            <option value="Manager">
                                👨‍💼 Manager
                            </option>

                        </select>


                        <span className="select-arrow">
                            ⌄
                        </span>

                    </div>


                    {/* ================================
                        ERROR
                    ================================= */}

                    {error && (

                        <div className="login-error">

                            {error}

                        </div>

                    )}


                    {/* ================================
                        REMEMBER + FORGOT
                    ================================= */}

                    <div className="login-options">


                        <label className="remember">

                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) =>
                                    setRememberMe(
                                        e.target.checked
                                    )
                                }
                            />


                            <span>
                                Remember me
                            </span>

                        </label>


                        <button
                            type="button"
                            className="forgot-password"
                        >
                            Forgot Password?
                        </button>

                    </div>


                    {/* ================================
                        SIGN IN
                    ================================= */}

                    <button
                        type="submit"
                        className="login-submit"
                    >
                        Sign In →
                    </button>


                </form>


                {/* ================================
                    REGISTER
                ================================= */}

                <div className="register-link">

                    <span>
                        Don't have an account?
                    </span>


                    <Link to="/register">
                        Create Account
                    </Link>

                </div>


                {/* ================================
                    FOOTER
                ================================= */}

                <div className="login-footer">

                    <span>
                        © 2026 Livora Inc.
                    </span>


                    <span>
                        Help Center
                    </span>


                    <span>
                        English (US)
                    </span>

                </div>


            </div>

        </div>

    );
}


export default Login;