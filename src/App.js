// frontend/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./auth/Login";
import Signup from './auth/Signup'
import Dashboard from "./components/dashboard/dashboard";
export default function App() {
  return (
    <Router>
      <AuthProvider>
      <div className="app">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Layout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/chat" element={<Dashboard />} />\
        </Routes>
      </div>
      </AuthProvider>
    </Router>
  );
}
