import { BrowserRouter, Routes, Route } from "react-router-dom";

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

                <Route
                    path="/resident-dashboard"
                    element={<ResidentDashboard />}
                />


                {/* ================= TECHNICIAN DASHBOARD ================= */}

                <Route
                    path="/technician-dashboard"
                    element={<TechnicianDashboard />}
                />


                {/* ================= MANAGER DASHBOARD ================= */}

                <Route
                    path="/manager-dashboard"
                    element={<ManagerDashboard />}
                />

            </Routes>

        </BrowserRouter>

    );

}


export default App;