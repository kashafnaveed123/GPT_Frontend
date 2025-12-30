// // src/components/Signup.js
// import React, { useState } from "react";
// import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
// import { motion } from "framer-motion";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// export default function Signup({ onSwitchToLogin }) {
//   const { signup } = useAuth();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate=useNavigate();
//   const handleSubmit = () => {
//     setError("");
    
//     if (!name || !email || !password || !confirmPassword) {
//       setError("Please fill in all fields");
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     if (password.length < 6) {
//       setError("Password must be at least 6 characters");
//       return;
//     }

//     setIsLoading(true);
    
//     // Simulate API call
//     setTimeout(() => {
//       const userData = {
//         name,
//         email,
//         joinedDate: new Date().toISOString(),
//       };
//       signup(userData);
//       setIsLoading(false);
//     }, 1000);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSubmit();
//     }
//   };

//   return (
//     <div 
//       className="min-h-screen flex items-center justify-center p-6" 
//       style={{
//         background: "linear-gradient(135deg, #FCE7F3 0%, #F3E8FF 100%)",
//       }}
//     >
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="w-full max-w-md"
//       >
//         <div className="bg-white rounded-3xl shadow-2xl p-8 border border-pink-100">
//           {/* Logo & Header */}
//           <div className="text-center mb-8">
//             <div
//               className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-4"
//               style={{
//                 background: "linear-gradient(135deg, #EC4899, #C026D3)",
//               }}
//             >
//               K
//             </div>
//             <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
//             <p className="text-pink-600">Join Kashaf's AI Assistant today</p>
//           </div>

//           {/* Form */}
//           <div className="space-y-5">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Full Name
//               </label>
//               <div className="relative">
//                 <User className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" size={20} />
//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   className="w-full pl-12 pr-4 py-3 border-2 border-pink-100 rounded-xl focus:border-pink-400 focus:outline-none transition-all"
//                   placeholder="John Doe"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" size={20} />
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   className="w-full pl-12 pr-4 py-3 border-2 border-pink-100 rounded-xl focus:border-pink-400 focus:outline-none transition-all"
//                   placeholder="you@example.com"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" size={20} />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   className="w-full pl-12 pr-12 py-3 border-2 border-pink-100 rounded-xl focus:border-pink-400 focus:outline-none transition-all"
//                   placeholder="••••••••"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600"
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Confirm Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" size={20} />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   className="w-full pl-12 pr-4 py-3 border-2 border-pink-100 rounded-xl focus:border-pink-400 focus:outline-none transition-all"
//                   placeholder="••••••••"
//                 />
//               </div>
//             </div>

//             {error && (
//               <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
//                 {error}
//               </div>
//             )}

//             <button
//               onClick={handleSubmit}
//               disabled={isLoading}
//               className="w-full py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
//               style={{
//                 background: "linear-gradient(135deg, #EC4899, #C026D3)",
//               }}
//             >
//               {isLoading ? "Creating Account..." : "Sign Up"}
//             </button>
//           </div>

//           {/* Switch to Login */}
//           <div className="mt-6 text-center">
//             <p className="text-gray-600 text-sm">
//               Already have an account?{" "}
//               <button
//                 onClick={onSwitchToLogin}
//                 className="text-pink-600 font-semibold hover:text-pink-700"
//               >
//                 Sign In
//               </button>
//             </p>
//           </div>

//              {/* continue as a guest */}
//           <div className="mt-6 text-center">
//             <p className="text-gray-600 text-sm">
//               Continue as a guest?{" "}
//               <button
//                 onClick={()=>navigate('/')}
//                 className="text-pink-600 font-semibold hover:text-pink-700"
//               >
//                 Click here
//               </button>
//             </p>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }




// // src/components/Signup.js
// import React, { useState } from "react";
// import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
// import { motion } from "framer-motion";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import API from "../services/ApiCalls"; // Import your API service

// export default function Signup({ onSwitchToLogin }) {
//   const { signup } = useAuth();
//   const navigate = useNavigate();
  
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const validateEmail = (email) => {
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return regex.test(email);
//   };

//   const handleSubmit = async () => {
//     setError("");
//     setSuccess("");
    
//     // Validation
//     if (!name || !email || !password || !confirmPassword) {
//       setError("Please fill in all fields");
//       return;
//     }

//     if (!validateEmail(email)) {
//       setError("Please enter a valid email address");
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     if (password.length < 6) {
//       setError("Password must be at least 6 characters");
//       return;
//     }

//     setIsLoading(true);
    
//     try {
//       // Call API to register user
//       const response = await API.auth.register({
//         email: email.trim().toLowerCase(),
//         password: password,
//         full_name: name.trim()
//       });

//       console.log("Registration successful:", response);

//       // Update auth context with user data
//       signup({
//         id: response.user.id,
//         name: response.user.full_name,
//         email: response.user.email,
//         joinedDate: response.user.created_at,
//       });

//       // Show success message
//       setSuccess("Account created successfully! Redirecting...");

//       // Redirect to chat after short delay
//       setTimeout(() => {
//         navigate('/login');
//       }, 1500);

//     } catch (err) {
//       console.error("Registration error:", err);
      
//       // Handle specific error messages
//       if (err.message.includes("already registered")) {
//         setError("This email is already registered. Please login instead.");
//       } else if (err.message.includes("network")) {
//         setError("Network error. Please check your connection and try again.");
//       } else {
//         setError(err.message || "Registration failed. Please try again.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !isLoading) {
//       handleSubmit();
//     }
//   };

//   return (
//     <div 
//       className="min-h-screen flex items-center justify-center p-6" 
//       style={{
//         background: "linear-gradient(135deg, #FCE7F3 0%, #F3E8FF 100%)",
//       }}
//     >
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="w-full max-w-md"
//       >
//         <div className="bg-white rounded-3xl shadow-2xl p-8 border border-pink-100">
//           {/* Logo & Header */}
//           <div className="text-center mb-8">
//             <div
//               className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-4"
//               style={{
//                 background: "linear-gradient(135deg, #EC4899, #C026D3)",
//               }}
//             >
//               K
//             </div>
//             <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
//             <p className="text-pink-600">Join Kashaf's AI Assistant today</p>
//           </div>

//           {/* Form */}
//           <div className="space-y-5">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Full Name
//               </label>
//               <div className="relative">
//                 <User className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" size={20} />
//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   disabled={isLoading}
//                   className="w-full pl-12 pr-4 py-3 border-2 border-pink-100 rounded-xl focus:border-pink-400 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                   placeholder="John Doe"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" size={20} />
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   disabled={isLoading}
//                   className="w-full pl-12 pr-4 py-3 border-2 border-pink-100 rounded-xl focus:border-pink-400 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                   placeholder="you@example.com"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" size={20} />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   disabled={isLoading}
//                   className="w-full pl-12 pr-12 py-3 border-2 border-pink-100 rounded-xl focus:border-pink-400 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                   placeholder="••••••••"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   disabled={isLoading}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600 disabled:opacity-50"
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Confirm Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" size={20} />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   disabled={isLoading}
//                   className="w-full pl-12 pr-4 py-3 border-2 border-pink-100 rounded-xl focus:border-pink-400 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                   placeholder="••••••••"
//                 />
//               </div>
//             </div>

//             {/* Password Requirements */}
//             <div className="bg-pink-50 border border-pink-200 rounded-xl p-3 text-xs text-gray-600">
//               <p className="font-semibold text-pink-600 mb-1">Password must contain:</p>
//               <ul className="space-y-1">
//                 <li className={password.length >= 6 ? "text-green-600" : ""}>
//                   • At least 6 characters
//                 </li>
//               </ul>
//             </div>

//             {/* Error Message */}
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2"
//               >
//                 <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
//                 <span>{error}</span>
//               </motion.div>
//             )}

//             {/* Success Message */}
//             {success && (
//               <motion.div
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2"
//               >
//                 <CheckCircle size={18} className="mt-0.5 flex-shrink-0" />
//                 <span>{success}</span>
//               </motion.div>
//             )}

//             {/* Submit Button */}
//             <button
//               onClick={handleSubmit}
//               disabled={isLoading}
//               className="w-full py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
//               style={{
//                 background: "linear-gradient(135deg, #EC4899, #C026D3)",
//               }}
//             >
//               {isLoading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                     <circle 
//                       className="opacity-25" 
//                       cx="12" 
//                       cy="12" 
//                       r="10" 
//                       stroke="currentColor" 
//                       strokeWidth="4"
//                       fill="none"
//                     />
//                     <path 
//                       className="opacity-75" 
//                       fill="currentColor" 
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     />
//                   </svg>
//                   Creating Account...
//                 </span>
//               ) : (
//                 "Sign Up"
//               )}
//             </button>
//           </div>

//           {/* Switch to Login */}
//           <div className="mt-6 text-center">
//             <p className="text-gray-600 text-sm">
//               Already have an account?{" "}
//               <button
//                 onClick={onSwitchToLogin}
//                 disabled={isLoading}
//                 className="text-pink-600 font-semibold hover:text-pink-700 disabled:opacity-50"
//               >
//                 Sign In
//               </button>
//             </p>
//           </div>

//           {/* Continue as a guest */}
//           <div className="mt-4 text-center">
//             <p className="text-gray-600 text-sm">
//               Continue as a guest?{" "}
//               <button
//                 onClick={() => navigate('/')}
//                 disabled={isLoading}
//                 className="text-pink-600 font-semibold hover:text-pink-700 disabled:opacity-50"
//               >
//                 Click here
//               </button>
//             </p>
//             <p className="text-gray-500 text-xs mt-1">
//               (Limited to 3 queries per day)
//             </p>
//           </div>
//         </div>

//         {/* Additional Info */}
//         <div className="mt-4 text-center text-sm text-gray-600">
//           <p>By signing up, you agree to get 5 queries per day</p>
//         </div>
//       </motion.div>
//     </div>
//   );
// }




// src/components/Signup.js
import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../services/ApiCalls";
import { Formik } from "formik";
import * as Yup from "yup";

export default function Signup({ onSwitchToLogin }) {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Yup Validation Schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Full name is required"),
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required("Confirm password is required"),
  });

  const handleSubmit = async (values) => {
    setError("");
    setSuccess("");

    setIsLoading(true);

    try {
      const response = await API.auth.register({
        email: values.email.trim().toLowerCase(),
        password: values.password,
        full_name: values.name.trim(),
      });

      signup({
        id: response.user.id,
        name: response.user.full_name,
        email: response.user.email,
        joinedDate: response.user.created_at,
      });

      setSuccess("Account created successfully! Redirecting...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);

      if (err.message.includes("already registered")) {
        setError("This email is already registered. Please login instead.");
      } else if (err.message.includes("network")) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(err.message || "Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
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
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-pink-100">

          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-4"
              style={{ background: "linear-gradient(135deg, #EC4899, #C026D3)" }}
            >
              K
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
            <p className="text-pink-600">Join Kashaf's AI Assistant today</p>
          </div>

          {/* Formik */}
          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {(formik) => (
              <div className="space-y-5">

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" size={20} />
                    <input
                      type="text"
                      name="name"
                      disabled={isLoading}
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full pl-12 pr-4 py-3 border-2 border-pink-100 rounded-xl focus:border-pink-400 transition-all disabled:opacity-50"
                      placeholder="Username"
                    />
                  </div>
                  {formik.touched.name && formik.errors.name && (
                    <small className="text-red-600">{formik.errors.name}</small>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" size={20} />
                    <input
                      type="email"
                      name="email"
                      disabled={isLoading}
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full pl-12 pr-4 py-3 border-2 border-pink-100 rounded-xl focus:border-pink-400 transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                  {formik.touched.email && formik.errors.email && (
                    <small className="text-red-600">{formik.errors.email}</small>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      disabled={isLoading}
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full pl-12 pr-12 py-3 border-2 border-pink-100 rounded-xl focus:border-pink-400 transition-all"
                      placeholder="••••••••"
                    />

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <small className="text-red-600">{formik.errors.password}</small>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      disabled={isLoading}
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full pl-12 pr-4 py-3 border-2 border-pink-100 rounded-xl focus:border-pink-400 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <small className="text-red-600">{formik.errors.confirmPassword}</small>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="bg-pink-50 border border-pink-200 rounded-xl p-3 text-xs text-gray-600">
                  <p className="font-semibold text-pink-600 mb-1">Password must contain:</p>
                  <ul className="space-y-1">
                    <li className={formik.values.password.length >= 6 ? "text-green-600" : ""}>
                      • At least 6 characters
                    </li>
                  </ul>
                </div>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2"
                  >
                    <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Success */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2"
                  >
                    <CheckCircle size={18} className="mt-0.5 flex-shrink-0" />
                    <span>{success}</span>
                  </motion.div>
                )}

                {/* Submit */}
                <button
                  onClick={formik.handleSubmit}
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #EC4899, #C026D3)" }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </div>
            )}
          </Formik>

          {/* Switch to Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <button
                onClick={()=>navigate('/login')}
                disabled={isLoading}
                className="text-pink-600 font-semibold hover:text-pink-700"
              >
                Sign In
              </button>
            </p>
          </div>

          {/* Guest */}
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              Continue as a guest?{" "}
              <button
                onClick={() => navigate('/')}
                disabled={isLoading}
                className="text-pink-600 font-semibold hover:text-pink-700"
              >
                Click here
              </button>
            </p>
            <p className="text-gray-500 text-xs mt-1">(Limited to 3 queries per day)</p>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>By signing up, you agree to get 5 queries per day</p>
        </div>
      </motion.div>
    </div>
  );
}
