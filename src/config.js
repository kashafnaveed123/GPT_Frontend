// frontend/src/config.js

// Now proxy is merged in backend, so use backend URL directly
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Production: relative path
  : 'http://localhost:8000/api';  // Development: backend with /api prefix

export const APP_CONFIG = {
  appName: "Kashaf GPT",
  version: "1.0.0"
};
// src/config.js
// export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
export const API_KEY = process.env.REACT_APP_API_KEY || "super-secret-token";
export const WHATSAPP_NUMBER = "+923276030700";
export const CONTACT_EMAIL = "222kashafnaveeed@example.com";