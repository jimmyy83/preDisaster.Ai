import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";

import Dashboard from "../pages/Dashboard";
import Chatbot from "../pages/Chatbot";
import Emergency from "../pages/Emergency";
import Report from "../pages/Report";
import Reports from "../pages/Reports";
import ProtectedRoute from "./ProtectedRoute";
import Auth from "../pages/Auth"; // ✅ NEW

const AppRoutes = () => {
  return (
    <Routes>

      {/* 🌍 Public */}
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} /> {/* ✅ NEW */}

      {/* (Optional backup) */}


      {/* 🔐 Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chatbot"
        element={
          <ProtectedRoute>
            <Chatbot />
          </ProtectedRoute>
        }
      />

      <Route
        path="/emergency"
        element={
          <ProtectedRoute>
            <Emergency />
          </ProtectedRoute>
        }
      />

      <Route
        path="/report"
        element={
          <ProtectedRoute>
            <Report />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
};

export default AppRoutes;