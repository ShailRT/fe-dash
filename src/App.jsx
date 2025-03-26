import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Dashboard from "./Components/Dashboard";
import DashEm from "./Components/DashEm";
import { UserProvider } from "./context/UserContext";
import SupDashboard from "./Components/SupDash";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard-supervisor" element={<SupDashboard />} />
          <Route path="/dashboard-employee/:id" element={<DashEm />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
