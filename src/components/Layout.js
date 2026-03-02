// import React, { useState , useCallback , useEffect } from "react";
// import TopBar from "./TopBar";
// import Sidebar from "./leftSide/SideBar";
// import ChatbotUI from "./ChatbotUI";
// import { API_BASE_URL } from "../config";
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import API from '../services/ApiCalls';
// export default function Layout({ children }) {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//    const { user } = useAuth();
//   const navigate = useNavigate();
//   // Chat state
//   const [chatHistory, setChatHistory] = useState({});
//   const [currentChatId, setCurrentChatId] = useState(null);
//   const [isLoadingChats, setIsLoadingChats] = useState(false);

//   // Load chat history when user logs in
//   useEffect(() => {
//     if (user) {
//       loadChatHistory();
//     } else {
//       // Clear chat history for non-authenticated users
//       setChatHistory({});
//       setCurrentChatId(null);
//     }
//   }, [user]);

//   // Load all chats from backend (grouped by date)
//   const loadChatHistory = async () => {
//     if (!user) return;

//     try {
//       setIsLoadingChats(true);
//       const groupedChats = await API.chats.list();
//       setChatHistory(groupedChats);
//       console.log('✅ Chat history loaded:', groupedChats);
//     } catch (error) {
//       console.error('❌ Failed to load chat history:', error);
//     } finally {
//       setIsLoadingChats(false);
//     }
//   };

//   // Handle creating a new chat
//   const handleNewChat = useCallback(async () => {
//     if (!user) {
//       // For non-authenticated users, just clear the current chat
//       setCurrentChatId(null);
//       return;
//     }

//     try {
//       // Create new chat
//       const newChat = await API.chats.create("New Chat");

//       // Set as current chat
//       setCurrentChatId(newChat.id);

//       // Reload chat history to show the new chat
//       await loadChatHistory();

//       console.log('✅ New chat created:', newChat.id);
//     } catch (error) {
//       console.error('❌ Failed to create new chat:', error);
//     }
//   }, [user]);

//   // Handle selecting a chat from sidebar
//   const handleSelectChat = useCallback((chatId) => {
//     setCurrentChatId(chatId);

//     // Close sidebar on mobile after selection
//     if (window.innerWidth < 1024) {
//       setIsSidebarOpen(false);
//     }
//   }, []);

//   // Handle deleting a chat
//   const handleDeleteChat = useCallback(async (chatId) => {
//     if (!user) return;

//     // Confirm deletion
//     if (!window.confirm('Are you sure you want to delete this chat?')) {
//       return;
//     }

//     try {
//       // Delete chat (soft delete by default)
//       await API.chats.delete(chatId, false);

//       // If deleted chat was current, clear current chat
//       if (currentChatId === chatId) {
//         setCurrentChatId(null);
//       }

//       // Reload chat history
//       await loadChatHistory();

//       console.log('✅ Chat deleted:', chatId);
//     } catch (error) {
//       console.error('❌ Failed to delete chat:', error);
//       alert('Failed to delete chat. Please try again.');
//     }
//   }, [user, currentChatId]);

//   // Handle pinning/unpinning a chat
//   const handlePinChat = useCallback(async (chatId, pinned) => {
//     if (!user) return;

//     try {
//       await API.chats.pin(chatId, pinned);

//       // Reload chat history to reflect the change
//       await loadChatHistory();

//       console.log(`✅ Chat ${pinned ? 'pinned' : 'unpinned'}:`, chatId);
//     } catch (error) {
//       console.error('❌ Failed to pin/unpin chat:', error);
//     }
//   }, [user]);

//   // Handle renaming a chat
//   const handleRenameChat = useCallback(async (chatId, newTitle) => {
//     if (!user) return;

//     try {
//       await API.chats.updateTitle(chatId, newTitle);

//       // Reload chat history to reflect the change
//       await loadChatHistory();

//       console.log('✅ Chat renamed:', chatId, newTitle);
//     } catch (error) {
//       console.error('❌ Failed to rename chat:', error);
//       alert('Failed to rename chat. Please try again.');
//     }
//   }, [user]);

//   // Handle chat ID change from ChatbotUI (when new chat is created during conversation)
//   const handleChatIdChange = useCallback((newChatId) => {
//     setCurrentChatId(newChatId);

//     // Reload chat history to show the new chat in sidebar
//     if (user && newChatId) {
//       loadChatHistory();
//     }
//   }, [user]);

//   // Handle logout
//   const handleLogout = useCallback(() => {
//     // Clear local state
//     setChatHistory({});
//     setCurrentChatId(null);
//     setIsSidebarOpen(false);
//   }, []);

//   // Toggle sidebar
//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//     const handleSend = async (userMessage) => {
//       console.log("🚀 Sending message:", userMessage);
//       console.log("📡 API URL:", `${API_BASE_URL}/query`);

//       try {
//         // Prepare form data
//         const formData = new FormData();
//         formData.append('q', userMessage);
//         formData.append('k', 1);

//         // Make API request
//         const response = await fetch(`${API_BASE_URL}/query`, {
//           method: "POST",
//           headers: {
//             "X-API-Key": "super-secret-token"
//           },
//           body: formData
//         });

//         console.log("📬 Response status:", response.status);

//         // Handle errors
//         if (!response.ok) {
//           const errorText = await response.text();
//           console.error("❌ Error:", errorText);

//           if (response.status === 401) {
//             throw new Error("Authentication failed");
//           } else if (response.status === 400) {
//             throw new Error("Vectorstore not initialized");
//           } else if (response.status === 502) {
//             throw new Error("Backend connection failed");
//           } else {
//             throw new Error(`HTTP ${response.status}`);
//           }
//         }

//         // Parse response
//         const data = await response.json();
//         console.log("✅ Full Response:", data);
//         console.log("📝 Answer field:", data.answer);
//         console.log("📝 Answer type:", typeof data.answer);
//         console.log("📝 Answer length:", data.answer?.length);
//         console.log("📝 Sources:", data.sources);

//         // Check if answer is empty
//         if (!data.answer || data.answer.trim() === "") {
//           console.warn("⚠️ Warning: Empty answer received from backend!");
//         }

//         return {
//           text: data.answer || "Sorry, I couldn't get a response from the backend.",
//           sources: data.sources?.map((src) => src.source) || [],
//         };

//       } catch (err) {
//         console.error("❌ Error:", err);

//         // User-friendly error messages
//         if (err.message.includes("Failed to fetch") || err.name === "TypeError") {
//           return { 
//             text: `⚠️ Cannot connect to backend.\n\nBackend URL: ${API_BASE_URL}\n\nPlease ensure:\n✓ Backend is running on port 8000\n✓ No firewall blocking\n✓ Correct API endpoint`,
//             sources: [] 
//           };
//         } else if (err.message.includes("Authentication")) {
//           return {
//             text: "⚠️ Authentication failed. Check API key configuration.",
//             sources: []
//           };
//         } else if (err.message.includes("Vectorstore")) {
//           return {
//             text: "⚠️ Vectorstore not initialized.\n\nRun: curl -X POST http://localhost:8000/ingest_local -H 'X-API-Key: super-secret-token'",
//             sources: []
//           };
//         } else {
//           return { 
//             text: `⚠️ Error: ${err.message}`,
//             sources: [] 
//           };
//         }
//       }
//     };

//   return (
//     <div className="flex h-screen overflow-hidden">
//       {/* Sidebar */}
//       {/* <Sidebar
//         isOpen={sidebarOpen}
//         onToggle={() => setSidebarOpen(!sidebarOpen)}
//         onMenuClick={() => setSidebarOpen(!sidebarOpen)}
//         chatHistory={[]}   // add your data
//         currentChatId={null}
//         onSelectChat={() => {}}
//         onNewChat={() => {}}
//         onDeleteChat={() => {}}
//         onLogout={() => {}}
//         userName="Guest"
//       /> */}

// {user && (
//         <Sidebar
//           isOpen={isSidebarOpen}
//           onToggle={toggleSidebar}
//           chatHistory={chatHistory}
//           currentChatId={currentChatId}
//           onSelectChat={handleSelectChat}
//           onNewChat={handleNewChat}
//           onDeleteChat={handleDeleteChat}
//           onPinChat={handlePinChat}
//           onRenameChat={handleRenameChat}
//           onLogout={handleLogout}
//           userName={user?.full_name || user?.name || 'User'}
//           onMenuClick={toggleSidebar}
//         />
//       )}
//       {/* Main Area */}
//       <div className="flex-1 flex flex-col"
//       onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
//       >
//         <TopBar />

//         {/* Main content */}
//         <main className="flex-1 overflow-y-auto bg-gray-50">

//         <ChatbotUI 
//                 onSend={handleSend}
//                 title="Kashaf GPT"
//                 subtitle="Let's talk with Kashaf Naveed"
//               />
//         </main>
//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import API from '../services/ApiCalls';
import ChatbotUI from './ChatbotUI';
import Sidebar from './leftSide/SideBar';
import TopBar from "./TopBar";

export default function Layout() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState({});
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Load chat history on mount and when user logs in
  useEffect(() => {
    if (user) {
      loadChatHistory();
    } else {
      // Clear history for guests
      setChatHistory({});
      setCurrentChatId(null);
    }
  }, [user]);

  // Load all chats from backend
  const loadChatHistory = async () => {
    if (!user) return;

    try {
      setIsLoadingHistory(true);
      const chats = await API.chats.getAll();

      // Backend returns grouped chats: { "Today": [...], "Yesterday": [...] }
      setChatHistory(chats);
    } catch (error) {
      console.error('Failed to load chat history:', error);
      toast.error('Failed to load chat history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Handle chat selection from sidebar
  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId);

    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  // Handle new chat creation
  const handleNewChat = () => {
    setCurrentChatId(null);

    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  // Handle chat deletion
  const handleDeleteChat = async (chatId) => {
    try {
      await API.chats.delete(chatId);

      // If deleted chat was active, reset to new chat
      if (currentChatId === chatId) {
        setCurrentChatId(null);
      }

      // Reload chat history
      await loadChatHistory();
    } catch (error) {
      console.error('Failed to delete chat:', error);
      throw error; // Re-throw so Sidebar can show error toast
    }
  };

  // Handle chat pinning
  const handlePinChat = async (chatId, shouldPin) => {
    try {
      await API.chats.pin(chatId, shouldPin);

      // Reload chat history to reflect changes
      await loadChatHistory();
    } catch (error) {
      console.error('Failed to pin/unpin chat:', error);
      throw error; // Re-throw so Sidebar can show error toast
    }
  };

  // Handle chat renaming
  const handleRenameChat = async (chatId, newTitle) => {
    try {
      await API.chats.rename(chatId, newTitle);

      // Reload chat history to reflect changes
      await loadChatHistory();
    } catch (error) {
      console.error('Failed to rename chat:', error);
      throw error; // Re-throw so Sidebar can show error toast
    }
  };

  // Handle chat ID change (new chat created in ChatbotUI)
  const handleChatIdChange = (newChatId) => {
    setCurrentChatId(newChatId);

    // Reload chat history to show new chat in sidebar
    if (newChatId && user) {
      loadChatHistory();
    }
  };

  // Handle chat update (when user continues chatting in an old chat)
  const handleChatUpdated = async (chatId) => {
    // Reload chat history to refresh grouping
    if (user) {
      await loadChatHistory();
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className=" flex  overflow-hidden">
      {/* Toast Container */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
            padding: '16px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
          success: {
            style: {
              background: '#EFF6FF',
              color: '#1E40AF',
              border: '1px solid #2563EB',
            },
            iconTheme: {
              primary: '#2563EB',
              secondary: '#fff',
            },
          },
          error: {
            style: {
              background: '#FEF2F2',
              color: '#DC2626',
              border: '1px solid #EF4444',
            },
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
          loading: {
            style: {
              background: '#F0F9FF',
              color: '#0284C7',
              border: '1px solid #0EA5E9',
            },
          },
        }}
      />

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        onMenuClick={toggleSidebar}
        chatHistory={chatHistory}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onPinChat={handlePinChat}
        onRenameChat={handleRenameChat}
        userName={user?.name || user?.full_name || "Guest"}
      />

      {/* Main Chat UI */}

      <div className="flex-1 flex flex-col"
        onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
      >         <TopBar />

        {/* Main content */}
        {/* <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-[680px]' : 'lg:ml-30'}`}> */}
        <ChatbotUI
          currentChatId={currentChatId}
          onChatIdChange={handleChatIdChange}
          onChatUpdated={handleChatUpdated}
        />
        {/* </div> */}
      </div>

      {/* <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-20'}`}>
        <ChatbotUI
          currentChatId={currentChatId}
          onChatIdChange={handleChatIdChange}
          onChatUpdated={handleChatUpdated}
        />
       </div> */}
    </div>
  );
}
