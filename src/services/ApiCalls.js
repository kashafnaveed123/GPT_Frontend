// // ============================================================
// // ENHANCED API SERVICE WITH CHAT HISTORY SUPPORT
// // Compatible with your backend v4.0
// // ============================================================

// const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000';

// // ============================================================
// // TOKEN MANAGEMENT
// // ============================================================
// class TokenManager {
//   static TOKEN_KEY = 'chatbot_auth_token';
//   static USER_KEY = 'chatbot_user';

//   static setToken(token) {
//     localStorage.setItem(this.TOKEN_KEY, token);
//   }

//   static getToken() {
//     return localStorage.getItem(this.TOKEN_KEY);
//   }

//   static removeToken() {
//     localStorage.removeItem(this.TOKEN_KEY);
//     localStorage.removeItem(this.USER_KEY);
//   }

//   static setUser(user) {
//     localStorage.setItem(this.USER_KEY, JSON.stringify(user));
//   }

//   static getUser() {
//     const user = localStorage.getItem(this.USER_KEY);
//     return user ? JSON.parse(user) : null;
//   }

//   static isAuthenticated() {
//     return !!this.getToken();
//   }
// }

// // ============================================================
// // HTTP CLIENT
// // ============================================================
// class HttpClient {
//   constructor(baseURL = API_BASE_URL) {
//     this.baseURL = baseURL;
//     this.defaultHeaders = {
//       'Content-Type': 'application/json',
//     };
//   }

//   // Get headers with auth token if available
//   getHeaders(customHeaders = {}) {
//     const headers = { ...this.defaultHeaders, ...customHeaders };
//     const token = TokenManager.getToken();
    
//     if (token) {
//       headers['Authorization'] = `Bearer ${token}`;
//     }
    
//     return headers;
//   }

//   // Handle API response
//   async handleResponse(response) {
//     const data = await response.json();
    
//     if (!response.ok) {
//       // Handle specific error cases
//       if (response.status === 401) {
//         console.log("Unauthorized - Session expired");
//         TokenManager.removeToken();
//         window.location.href = '/login';
//         throw new Error('Session expired. Please login again.');
//       }
      
//       throw new Error(data.detail || data.message || 'API request failed');
//     }

//     return data;
//   }

//   // GET request
//   async get(endpoint, options = {}) {
//     try {
//       const response = await fetch(`${this.baseURL}${endpoint}`, {
//         method: 'GET',
//         headers: this.getHeaders(options.headers),
//         ...options,
//       });

//       return await this.handleResponse(response);
//     } catch (error) {
//       console.error(`GET ${endpoint} failed:`, error);
//       throw error;
//     }
//   }

//   // POST request
//   async post(endpoint, data = null, options = {}) {
//     try {
//       const response = await fetch(`${this.baseURL}${endpoint}`, {
//         method: 'POST',
//         headers: this.getHeaders(options.headers),
//         body: data ? JSON.stringify(data) : null,
//         ...options,
//       });

//       return await this.handleResponse(response);
//     } catch (error) {
//       console.error(`POST ${endpoint} failed:`, error);
//       throw error;
//     }
//   }

//   // POST with form data
//   async postFormData(endpoint, formData, options = {}) {
//     try {
//       const headers = this.getHeaders(options.headers);
//       delete headers['Content-Type']; // Let browser set it for FormData

//       const response = await fetch(`${this.baseURL}${endpoint}`, {
//         method: 'POST',
//         headers,
//         body: formData,
//         ...options,
//       });

//       return await this.handleResponse(response);
//     } catch (error) {
//       console.error(`POST ${endpoint} (FormData) failed:`, error);
//       throw error;
//     }
//   }

//   // PUT request
//   async put(endpoint, data, options = {}) {
//     try {
//       const response = await fetch(`${this.baseURL}${endpoint}`, {
//         method: 'PUT',
//         headers: this.getHeaders(options.headers),
//         body: JSON.stringify(data),
//         ...options,
//       });

//       return await this.handleResponse(response);
//     } catch (error) {
//       console.error(`PUT ${endpoint} failed:`, error);
//       throw error;
//     }
//   }

//   // PUT with form data
//   async putFormData(endpoint, formData, options = {}) {
//     try {
//       const headers = this.getHeaders(options.headers);
//       delete headers['Content-Type']; // Let browser set it for FormData

//       const response = await fetch(`${this.baseURL}${endpoint}`, {
//         method: 'PUT',
//         headers,
//         body: formData,
//         ...options,
//       });

//       return await this.handleResponse(response);
//     } catch (error) {
//       console.error(`PUT ${endpoint} (FormData) failed:`, error);
//       throw error;
//     }
//   }

//   // DELETE request
//   async delete(endpoint, options = {}) {
//     try {
//       const response = await fetch(`${this.baseURL}${endpoint}`, {
//         method: 'DELETE',
//         headers: this.getHeaders(options.headers),
//         ...options,
//       });

//       return await this.handleResponse(response);
//     } catch (error) {
//       console.error(`DELETE ${endpoint} failed:`, error);
//       throw error;
//     }
//   }
// }

// // Create HTTP client instance
// const httpClient = new HttpClient();

// // ============================================================
// // API SERVICE
// // ============================================================
// const API = {
//   // ========== AUTHENTICATION ==========
//   auth: {
//     /**
//      * Register a new user
//      * @param {Object} userData - { email, password, full_name }
//      * @returns {Promise<Object>} { access_token, token_type, user }
//      */
//     async register(userData) {
//       try {
//         const response = await httpClient.post('/auth/register', userData);
        
//         // Save token and user info
//         TokenManager.setToken(response.access_token);
//         TokenManager.setUser(response.user);
        
//         return response;
//       } catch (error) {
//         throw new Error(error.message || 'Registration failed');
//       }
//     },

//     /**
//      * Login user
//      * @param {Object} credentials - { email, password }
//      * @returns {Promise<Object>} { access_token, token_type, user }
//      */
//     async login(credentials) {
//       try {
//         const response = await httpClient.post('/auth/login', credentials);
        
//         // Save token and user info
//         TokenManager.setToken(response.access_token);
//         TokenManager.setUser(response.user);
        
//         return response;
//       } catch (error) {
//         throw new Error(error.message || 'Login failed');
//       }
//     },

//     /**
//      * Logout user
//      */
//     logout() {
//       TokenManager.removeToken();
//       window.location.href = '/login';
//     },

//     /**
//      * Get current user profile
//      * @returns {Promise<Object>} User profile
//      */
//     async getProfile() {
//       try {
//         return await httpClient.get('/auth/me');
//       } catch (error) {
//         throw new Error(error.message || 'Failed to get profile');
//       }
//     },

//     /**
//      * Verify if token is valid
//      * @returns {Promise<Object>} { valid, user_id, email }
//      */
//     async verifyToken() {
//       try {
//         return await httpClient.get('/auth/verify');
//       } catch (error) {
//         TokenManager.removeToken();
//         return { valid: false };
//       }
//     },

//     /**
//      * Check if user is authenticated
//      * @returns {boolean}
//      */
//     isAuthenticated() {
//       return TokenManager.isAuthenticated();
//     },

//     /**
//      * Get current user from storage
//      * @returns {Object|null}
//      */
//     getCurrentUser() {
//       return TokenManager.getUser();
//     },
//   },

//   // ========== CHATBOT QUERIES ==========
//   chat: {
//     /**
//      * Send authenticated query (requires login)
//      * @param {string} question - User's question
//      * @param {number} k - Number of documents to retrieve (default: 1)
//      * @param {string} chatId - Optional chat ID to save conversation
//      * @returns {Promise<Object>} { answer, sources, limit_info, chat_id, messages_saved }
//      */
//     async query(question, k = 1, chatId = null) {
//       try {
//         const payload = { q: question, k };
//         if (chatId) {
//           payload.chat_id = chatId;
//         }
//         return await httpClient.post('/api/query', payload);
//       } catch (error) {
//         throw new Error(error.message || 'Query failed');
//       }
//     },

//     /**
//      * Send public query (no login required, 3 queries/day limit)
//      * @param {string} question - User's question
//      * @param {number} k - Number of documents to retrieve (default: 1)
//      * @returns {Promise<Object>} { answer, sources, limit_info }
//      */
//     async queryPublic(question, k = 1) {
//       try {
//         return await httpClient.post('/api/query/public', { q: question, k });
//       } catch (error) {
//         throw new Error(error.message || 'Public query failed');
//       }
//     },

//     /**
//      * Smart query - automatically uses authenticated or public endpoint
//      * @param {string} question - User's question
//      * @param {number} k - Number of documents to retrieve (default: 1)
//      * @param {string} chatId - Optional chat ID (only for authenticated users)
//      * @returns {Promise<Object>} { answer, sources, limit_info }
//      */
//     async smartQuery(question, k = 1, chatId = null) {
//       const isAuth = TokenManager.isAuthenticated();
      
//       if (isAuth) {
//         return await this.query(question, k, chatId);
//       } else {
//         return await this.queryPublic(question, k);
//       }
//     },
//   },

//   // ========== ENHANCED CHAT HISTORY MANAGEMENT ==========
//   chats: {
//     /**
//      * Create a new chat
//      * @param {string} title - Chat title (optional, defaults to "New Chat")
//      * @param {string} firstMessage - First message to auto-generate title
//      * @returns {Promise<Object>} { id, user_id, title, preview, date, category, created_at, updated_at, message_count }
//      */
//     async create(title = "New Chat", firstMessage = null) {
//       try {
//         const formData = new FormData();
//         formData.append('title', title);
//         if (firstMessage) {
//           formData.append('first_message', firstMessage);
//         }
        
//         return await httpClient.postFormData('/chats/create', formData);
//       } catch (error) {
//         throw new Error(error.message || 'Failed to create chat');
//       }
//     },

//     /**
//      * Get all chats for current user, grouped by date
//      * @param {boolean} includeArchived - Include archived chats
//      * @returns {Promise<Object>} { "Today": [...], "Yesterday": [...], "Last 7 Days": [...], etc. }
//      */
//     async list(includeArchived = false) {
//       try {
//         const url = includeArchived ? '/chats?include_archived=true' : '/chats';
//         return await httpClient.get(url);
//       } catch (error) {
//         throw new Error(error.message || 'Failed to get chats');
//       }
//     },

//     /**
//      * Get all chats as flat array (for backward compatibility)
//      * @returns {Promise<Array>} Array of all chats sorted by most recent
//      */
//     async listFlat() {
//       try {
//         const grouped = await this.list();
//         const flatArray = [];
        
//         // Convert grouped object to flat array
//         Object.values(grouped).forEach(categoryChats => {
//           flatArray.push(...categoryChats);
//         });
        
//         return flatArray;
//       } catch (error) {
//         throw new Error(error.message || 'Failed to get chats');
//       }
//     },

//     /**
//      * Get all messages in a specific chat
//      * @param {string} chatId - Chat ID
//      * @param {number} limit - Maximum number of messages to retrieve
//      * @returns {Promise<Array>} Array of message objects
//      */
//     async getMessages(chatId, limit = 1000) {
//       try {
//         return await httpClient.get(`/chats/${chatId}/messages?limit=${limit}`);
//       } catch (error) {
//         throw new Error(error.message || 'Failed to get messages');
//       }
//     },

//     /**
//      * Delete a chat
//      * @param {string} chatId - Chat ID
//      * @param {boolean} permanent - If true, permanently delete (hard delete)
//      * @returns {Promise<Object>} { message: "Chat deleted successfully", permanent }
//      */
//     async delete(chatId, permanent = false) {
//       try {
//         return await httpClient.delete(`/chats/${chatId}?permanent=${permanent}`);
//       } catch (error) {
//         throw new Error(error.message || 'Failed to delete chat');
//       }
//     },

//     /**
//      * Update chat title
//      * @param {string} chatId - Chat ID
//      * @param {string} newTitle - New title
//      * @returns {Promise<Object>} { message: "Chat title updated successfully", title }
//      */
//     async updateTitle(chatId, newTitle) {
//       try {
//         const formData = new FormData();
//         formData.append('title', newTitle);
        
//         return await httpClient.putFormData(`/chats/${chatId}/title`, formData);
//       } catch (error) {
//         throw new Error(error.message || 'Failed to update chat title');
//       }
//     },

//     /**
//      * Pin or unpin a chat
//      * @param {string} chatId - Chat ID
//      * @param {boolean} pinned - True to pin, false to unpin
//      * @returns {Promise<Object>} { message: "Chat pinned/unpinned successfully" }
//      */
//     async pin(chatId, pinned = true) {
//       try {
//         const formData = new FormData();
//         formData.append('pinned', pinned.toString());
        
//         return await httpClient.putFormData(`/chats/${chatId}/pin`, formData);
//       } catch (error) {
//         throw new Error(error.message || 'Failed to pin chat');
//       }
//     },

//     /**
//      * Archive or unarchive a chat
//      * @param {string} chatId - Chat ID
//      * @param {boolean} archived - True to archive, false to unarchive
//      * @returns {Promise<Object>} { message: "Chat archived/unarchived successfully" }
//      */
//     async archive(chatId, archived = true) {
//       try {
//         const formData = new FormData();
//         formData.append('archived', archived.toString());
        
//         return await httpClient.putFormData(`/chats/${chatId}/archive`, formData);
//       } catch (error) {
//         throw new Error(error.message || 'Failed to archive chat');
//       }
//     },

//     /**
//      * Search chats by title or content
//      * @param {string} query - Search query
//      * @param {number} limit - Maximum number of results
//      * @returns {Promise<Array>} Array of matching chats
//      */
//     async search(query, limit = 20) {
//       try {
//         return await httpClient.get(`/chats/search?q=${encodeURIComponent(query)}&limit=${limit}`);
//       } catch (error) {
//         throw new Error(error.message || 'Failed to search chats');
//       }
//     },

//     /**
//      * Get chat statistics
//      * @returns {Promise<Object>} { total_chats, total_messages, average_messages_per_chat }
//      */
//     async getStatistics() {
//       try {
//         return await httpClient.get('/chats/statistics');
//       } catch (error) {
//         throw new Error(error.message || 'Failed to get statistics');
//       }
//     },

//     /**
//      * Start a new chat session and return chat ID
//      * Convenience method that creates chat and returns ID
//      * @param {string} title - Optional initial title
//      * @returns {Promise<string>} Chat ID
//      */
//     async startNewChat(title = "New Chat") {
//       try {
//         const chat = await this.create(title);
//         return chat.id;
//       } catch (error) {
//         throw new Error(error.message || 'Failed to start new chat');
//       }
//     },
//   },

//   // ========== QUERY LIMITS ==========
//   limits: {
//     /**
//      * Get authenticated user's query limits
//      * @returns {Promise<Object>} { allowed, limit, current, remaining }
//      */
//     async getAuthenticatedLimits() {
//       try {
//         return await httpClient.get('/query/limits');
//       } catch (error) {
//         throw new Error(error.message || 'Failed to get limits');
//       }
//     },

//     /**
//      * Get public user's query limits (IP-based)
//      * @returns {Promise<Object>} { allowed, limit, current, remaining }
//      */
//     async getPublicLimits() {
//       try {
//         return await httpClient.get('/query/limits/public');
//       } catch (error) {
//         throw new Error(error.message || 'Failed to get public limits');
//       }
//     },

//     /**
//      * Smart limits check - automatically uses correct endpoint
//      * @returns {Promise<Object>} { allowed, limit, current, remaining }
//      */
//     async getLimits() {
//       const isAuth = TokenManager.isAuthenticated();
      
//       if (isAuth) {
//         return await this.getAuthenticatedLimits();
//       } else {
//         return await this.getPublicLimits();
//       }
//     },
//   },

//   // ========== HEALTH & INFO ==========
//   system: {
//     /**
//      * Get system health status
//      * @returns {Promise<Object>} Health status
//      */
//     async health() {
//       try {
//         return await httpClient.get('/health');
//       } catch (error) {
//         throw new Error(error.message || 'Health check failed');
//       }
//     },

//     /**
//      * Get API info
//      * @returns {Promise<Object>} API information
//      */
//     async info() {
//       try {
//         return await httpClient.get('/');
//       } catch (error) {
//         throw new Error(error.message || 'Failed to get API info');
//       }
//     },
//   },
// };

// // ============================================================
// // EXPORT
// // ============================================================
// export default API;
// export { TokenManager, HttpClient };












// ============================================================
// ENHANCED API SERVICE WITH CHAT HISTORY SUPPORT
// Compatible with your backend v4.0
// ============================================================

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000';

// ============================================================
// TOKEN MANAGEMENT
// ============================================================
class TokenManager {
  static TOKEN_KEY = 'chatbot_auth_token';
  static USER_KEY = 'chatbot_user';

  static setToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static removeToken() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static setUser(user) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static getUser() {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  static isAuthenticated() {
    return !!this.getToken();
  }
}

// ============================================================
// HTTP CLIENT
// ============================================================
class HttpClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  getHeaders(customHeaders = {}) {
    const headers = { ...this.defaultHeaders, ...customHeaders };
    const token = TokenManager.getToken();
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 401) {
        console.log("Unauthorized - Invalid Credentials.");
        TokenManager.removeToken();
        window.location.href = '/login';
        throw new Error('Please login again.Invalid Credentials.');
      }
      
      throw new Error(data.detail || data.message || 'API request failed');
    }

    return data;
  }

  async get(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(options.headers),
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    }
  }

  async post(endpoint, data = null, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(options.headers),
        body: data ? JSON.stringify(data) : null,
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error);
      throw error;
    }
  }

  async postFormData(endpoint, formData, options = {}) {
    try {
      const headers = this.getHeaders(options.headers);
      delete headers['Content-Type'];

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`POST ${endpoint} (FormData) failed:`, error);
      throw error;
    }
  }

  async put(endpoint, data, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(options.headers),
        body: JSON.stringify(data),
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`PUT ${endpoint} failed:`, error);
      throw error;
    }
  }

  async putFormData(endpoint, formData, options = {}) {
    try {
      const headers = this.getHeaders(options.headers);
      delete headers['Content-Type'];

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: formData,
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`PUT ${endpoint} (FormData) failed:`, error);
      throw error;
    }
  }

  async delete(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(options.headers),
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`DELETE ${endpoint} failed:`, error);
      throw error;
    }
  }
}

const httpClient = new HttpClient();

// ============================================================
// API SERVICE
// ============================================================
const API = {
  // ========== AUTHENTICATION ==========
  auth: {
    async register(userData) {
      try {
        const response = await httpClient.post('/auth/register', userData);
        TokenManager.setToken(response.access_token);
        TokenManager.setUser(response.user);
        return response;
      } catch (error) {
        throw new Error(error.message || 'Registration failed');
      }
    },

    async login(credentials) {
      try {
        const response = await httpClient.post('/auth/login', credentials);
        TokenManager.setToken(response.access_token);
        TokenManager.setUser(response.user);
        return response;
      } catch (error) {
        throw new Error(error.message || 'Login failed');
      }
    },

    logout() {
      TokenManager.removeToken();
      window.location.href = '/login';
    },

    async getProfile() {
      try {
        return await httpClient.get('/auth/me');
      } catch (error) {
        throw new Error(error.message || 'Failed to get profile');
      }
    },

    async verifyToken() {
      try {
        return await httpClient.get('/auth/verify');
      } catch (error) {
        TokenManager.removeToken();
        return { valid: false };
      }
    },

    isAuthenticated() {
      return TokenManager.isAuthenticated();
    },

    getCurrentUser() {
      return TokenManager.getUser();
    },
  },

  // ========== CHATBOT QUERIES ==========
  chat: {
    async query(question, k = 1, chatId = null) {
      try {
        const payload = { q: question, k };
        if (chatId) {
          payload.chat_id = chatId;
        }
        return await httpClient.post('/api/query', payload);
      } catch (error) {
        throw new Error(error.message || 'Query failed');
      }
    },

    async queryPublic(question, k = 1) {
      try {
        return await httpClient.post('/api/query/public', { q: question, k });
      } catch (error) {
        throw new Error(error.message || 'Public query failed');
      }
    },

    async smartQuery(question, k = 1, chatId = null) {
      const isAuth = TokenManager.isAuthenticated();
      
      if (isAuth) {
        return await this.query(question, k, chatId);
      } else {
        return await this.queryPublic(question, k);
      }
    },
  },

  // ========== ENHANCED CHAT HISTORY MANAGEMENT ==========
  chats: {
    async create(title = "New Chat", firstMessage = null) {
      try {
        const formData = new FormData();
        formData.append('title', title);
        if (firstMessage) {
          formData.append('first_message', firstMessage);
        }
        
        return await httpClient.postFormData('/chats/create', formData);
      } catch (error) {
        throw new Error(error.message || 'Failed to create chat');
      }
    },

    async getAll(includeArchived = false) {
      try {
        const url = includeArchived ? '/chats?include_archived=true' : '/chats';
        return await httpClient.get(url);
      } catch (error) {
        throw new Error(error.message || 'Failed to get chats');
      }
    },

    async list(includeArchived = false) {
      return this.getAll(includeArchived);
    },

    async listFlat() {
      try {
        const grouped = await this.list();
        const flatArray = [];
        
        Object.values(grouped).forEach(categoryChats => {
          flatArray.push(...categoryChats);
        });
        
        return flatArray;
      } catch (error) {
        throw new Error(error.message || 'Failed to get chats');
      }
    },

    async getMessages(chatId, limit = 1000) {
      try {
        return await httpClient.get(`/chats/${chatId}/messages?limit=${limit}`);
      } catch (error) {
        throw new Error(error.message || 'Failed to get messages');
      }
    },

    async delete(chatId, permanent = false) {
      try {
        return await httpClient.delete(`/chats/${chatId}?permanent=${permanent}`);
      } catch (error) {
        throw new Error(error.message || 'Failed to delete chat');
      }
    },

    async updateTitle(chatId, newTitle) {
      try {
        const formData = new FormData();
        formData.append('title', newTitle);
        
        return await httpClient.putFormData(`/chats/${chatId}/title`, formData);
      } catch (error) {
        throw new Error(error.message || 'Failed to update chat title');
      }
    },

    async rename(chatId, newTitle) {
      return this.updateTitle(chatId, newTitle);
    },

    async pin(chatId, pinned = true) {
      try {
        const formData = new FormData();
        formData.append('pinned', pinned.toString());
        
        return await httpClient.putFormData(`/chats/${chatId}/pin`, formData);
      } catch (error) {
        throw new Error(error.message || 'Failed to pin chat');
      }
    },

    async archive(chatId, archived = true) {
      try {
        const formData = new FormData();
        formData.append('archived', archived.toString());
        
        return await httpClient.putFormData(`/chats/${chatId}/archive`, formData);
      } catch (error) {
        throw new Error(error.message || 'Failed to archive chat');
      }
    },

    async search(query, limit = 20) {
      try {
        return await httpClient.get(`/chats/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      } catch (error) {
        throw new Error(error.message || 'Failed to search chats');
      }
    },

    async getStatistics() {
      try {
        return await httpClient.get('/chats/statistics');
      } catch (error) {
        throw new Error(error.message || 'Failed to get statistics');
      }
    },

    async startNewChat(title = "New Chat") {
      try {
        const chat = await this.create(title);
        return chat.id;
      } catch (error) {
        throw new Error(error.message || 'Failed to start new chat');
      }
    },
  },

  // ========== QUERY LIMITS ==========
  limits: {
    async getAuthenticatedLimits() {
      try {
        return await httpClient.get('/query/limits');
      } catch (error) {
        throw new Error(error.message || 'Failed to get limits');
      }
    },

    async getPublicLimits() {
      try {
        return await httpClient.get('/query/limits/public');
      } catch (error) {
        throw new Error(error.message || 'Failed to get public limits');
      }
    },

    async getLimits() {
      const isAuth = TokenManager.isAuthenticated();
      
      if (isAuth) {
        return await this.getAuthenticatedLimits();
      } else {
        return await this.getPublicLimits();
      }
    },
  },

  // ========== HEALTH & INFO ==========
  system: {
    async health() {
      try {
        return await httpClient.get('/health');
      } catch (error) {
        throw new Error(error.message || 'Health check failed');
      }
    },

    async info() {
      try {
        return await httpClient.get('/');
      } catch (error) {
        throw new Error(error.message || 'Failed to get API info');
      }
    },
  },
};

export default API;
export { TokenManager, HttpClient };