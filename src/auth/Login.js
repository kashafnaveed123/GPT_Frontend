// src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import API from "../services/ApiCalls";

// Formik + Yup
import { Formik } from "formik";
import * as Yup from "yup";

export default function Login({ onSwitchToSignup }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Yup validation schema
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  // Actual submit handler
  const handleLoginSubmit = async (values) => {
    setError("");
    setSuccess("");

    setIsLoading(true);

    try {
      const response = await API.auth.login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      login({
        id: response.user.id,
        name: response.user.full_name,
        email: response.user.email,
        joinedDate: response.user.created_at,
      });

      setSuccess("Login successful! Redirecting...");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      console.error("Login error:", err);

      if (err.message?.includes("Incorrect email or password")) {
        setError("Invalid email or password. Please try again.");
      } else if (err.message?.includes("inactive")) {
        setError("Your account has been deactivated. Please contact support.");
      } else if (err.message?.includes("network")) {
        setError("Network error. Please check your connection.");
      } else {
        setError(err.message || "Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
      // setSubmitting(false); 
    }
  };

  const handleGuestMode = () => {
    navigate("/");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: "linear-gradient(135deg, #FCE7F3 0%, #F3E8FF 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-blue-100">
          
          <div className="text-center mb-8">
            <div
              className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-4"
              style={{
                background: "linear-gradient(135deg, #2563EB, #1E40AF)",
              }}
            >
              K
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-blue-600">Sign in to continue to Kashaf's AI Assistant</p>
          </div>

          {/* Formik Wrapper */}
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleLoginSubmit}
          >
            {({ values, errors, touched, handleChange, handleSubmit, handleBlur }) => (
              <>
                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
                      <input
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isLoading}
                        className="w-full pl-12 pr-4 py-3 border-2 border-blue-100 rounded-xl focus:border-blue-400 focus:outline-none transition-all disabled:opacity-50"
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                    </div>
                    {errors.email && touched.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isLoading}
                        className="w-full pl-12 pr-12 py-3 border-2 border-blue-100 rounded-xl focus:border-blue-400 focus:outline-none transition-all disabled:opacity-50"
                        placeholder="••••••••"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && touched.password && (
                      <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                    )}
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2"
                    >
                      <AlertCircle size={18} className="mt-0.5" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {/* Success Message */}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2"
                    >
                      <CheckCircle size={18} className="mt-0.5" />
                      <span>{success}</span>
                    </motion.div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"

                    disabled={isLoading}
                    className="w-full py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                    style={{
                      background: "linear-gradient(135deg, #2563EB, #1E40AF)",
                    }}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </button>

                  {/* Forgot Password */}
                  <div className="text-center">
                    <button
                      type="button"
                      disabled={isLoading}
                      className="text-sm text-blue-600 font-medium disabled:opacity-50"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </form>

                {/* Switch */}
                <div className="mt-6 text-center">
                  <p className="text-gray-600 text-sm">
                    Don't have an account?{" "}
                    <button
                      onClick={() => navigate("/signup")}
                      type="button"
                      disabled={isLoading}
                      className="text-blue-600 font-semibold hover:text-blue-700"
                    >
                      Sign Up
                    </button>
                  </p>
                </div>

                {/* Guest Mode */}
                <div className="mt-4 text-center">
                  <p className="text-gray-600 text-sm">
                    Continue as a guest?{" "}
                    <button
                      onClick={handleGuestMode}
                      type="button"
                      disabled={isLoading}
                      className="text-blue-600 font-semibold hover:text-blue-700"
                    >
                      Click here
                    </button>
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    (Limited to 3 queries per day)
                  </p>
                </div>
              </>
            )}
          </Formik>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Login to get 5 queries per day 🚀</p>
        </div>
      </motion.div>
    </div>
  );
}
