import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "../styles/Login.css";
import api, { apiError, saveSession } from "../api";
import type { User } from "../api";

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


    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;
        setError("");
        if (!email.trim() || !password) {
            setError("Please enter your email and password.");
            return;
        }
        setLoading(true);
        try {
            const { data } = await api.post<{ token: string; user: User }>("/auth/login", {
                email: email.trim(), password, role: role.toLowerCase(),
            });
            saveSession(data.token, data.user, rememberMe);
            navigate(`/${data.user.role}-dashboard`, { replace: true });
        } catch (error) {
            setError(apiError(error));
        } finally {
            setLoading(false);
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
                            onClick={() => setError("Please contact your apartment manager for help recovering your account.")}
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
                        disabled={loading}
                    >
                        {loading ? "Signing in…" : "Sign In →"}
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
