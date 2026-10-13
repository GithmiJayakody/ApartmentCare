import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ResidentDashboard from "./pages/ResidentDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";


function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* ================= HOME ================= */}

                <Route
                    path="/"
                    element={<Home />}
                />


                {/* ================= REGISTER ================= */}

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* ================= LOGIN ================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* ================= RESIDENT DASHBOARD ================= */}

                <Route element={<ProtectedRoute role="resident" />}>
                    <Route path="/resident-dashboard" element={<ResidentDashboard />} />
                </Route>


                {/* ================= TECHNICIAN DASHBOARD ================= */}

                <Route element={<ProtectedRoute role="technician" />}>
                    <Route path="/technician-dashboard" element={<TechnicianDashboard />} />
                </Route>


                {/* ================= MANAGER DASHBOARD ================= */}

                <Route element={<ProtectedRoute role="manager" />}>
                    <Route path="/manager-dashboard" element={<ManagerDashboard />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>

        </BrowserRouter>

    );

}


export default App;
