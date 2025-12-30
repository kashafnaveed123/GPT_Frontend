import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../leftSide/SideBar';
import ChatbotUI from '../ChatbotUI';
import API from '../../services/ApiCalls';

/**
 * Enhanced Dashboard Component
 * Integrates Sidebar and ChatbotUI with full chat history support
 * This component manages the chat state and coordinates between sidebar and chat
 */
export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Chat State
  const [chatHistory, setChatHistory] = useState({}); // Grouped by date from backend
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isLoadingChats, setIsLoadingChats] = useState(false);

  // Load chat history on mount and when user changes
  useEffect(() => {
    if (user) {
      loadChatHistory();
    } else {
      // Clear chat history for guests
      setChatHistory({});
      setCurrentChatId(null);
    }
  }, [user]);

  // Auto-close sidebar on mobile when chat is selected
  useEffect(() => {
    if (currentChatId && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [currentChatId]);

  /**
   * Load all chats from backend
   * Backend returns grouped object: { "Today": [...], "Yesterday": [...], etc. }
   */
  const loadChatHistory = async () => {
    if (!user) return;

    try {
      setIsLoadingChats(true);
      const chats = await API.chats.list();
      setChatHistory(chats);
    } catch (error) {
      console.error('Failed to load chat history:', error);
      // Show empty state on error
      setChatHistory({});
    } finally {
      setIsLoadingChats(false);
    }
  };

  /**
   * Create a new chat
   */
  const handleNewChat = async () => {
    if (!user) {
      // For guests, just clear current chat
      setCurrentChatId(null);
      return;
    }

    try {
      // Create new chat in backend
      const newChat = await API.chats.create("New Chat");
      
      // Switch to new chat
      setCurrentChatId(newChat.id);
      
      // Reload chat history to show new chat
      await loadChatHistory();
      
    } catch (error) {
      console.error('Failed to create new chat:', error);
      alert('Failed to create new chat. Please try again.');
    }
  };

  /**
   * Select a chat from sidebar
   */
  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId);
  };

  /**
   * Delete a chat
   */
  const handleDeleteChat = async (chatId) => {
    if (!user) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this chat?');
    if (!confirmDelete) return;

    try {
      await API.chats.delete(chatId, false); // Soft delete by default
      
      // If deleted chat was active, clear it
      if (currentChatId === chatId) {
        setCurrentChatId(null);
      }
      
      // Reload chat history
      await loadChatHistory();
      
    } catch (error) {
      console.error('Failed to delete chat:', error);
      alert('Failed to delete chat. Please try again.');
    }
  };

  /**
   * Pin/Unpin a chat
   */
  const handlePinChat = async (chatId, pinned) => {
    if (!user) return;

    try {
      await API.chats.pin(chatId, pinned);
      
      // Reload chat history to show updated pin status
      await loadChatHistory();
      
    } catch (error) {
      console.error('Failed to pin/unpin chat:', error);
      alert('Failed to update chat. Please try again.');
    }
  };

  /**
   * Rename a chat
   */
  const handleRenameChat = async (chatId, newTitle) => {
    if (!user || !newTitle.trim()) return;

    try {
      await API.chats.updateTitle(chatId, newTitle);
      
      // Reload chat history to show updated title
      await loadChatHistory();
      
    } catch (error) {
      console.error('Failed to rename chat:', error);
      alert('Failed to rename chat. Please try again.');
    }
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    // Clear state
    setChatHistory({});
    setCurrentChatId(null);
  };

  /**
   * When ChatbotUI creates a new chat or changes chat ID
   */
  const handleChatIdChange = async (newChatId) => {
    setCurrentChatId(newChatId);
    
    // Reload chat history to show the new/updated chat
    if (user && newChatId) {
      await loadChatHistory();
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      {user && (
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
          chatHistory={chatHistory} // Pass grouped chat history
          currentChatId={currentChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          onPinChat={handlePinChat}
          onRenameChat={handleRenameChat}
          onLogout={handleLogout}
          userName={user?.name || user?.full_name || 'User'}
          onMenuClick={toggleSidebar}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 overflow-hidden">
        <ChatbotUI
          currentChatId={currentChatId}
          onChatIdChange={handleChatIdChange}
        />
      </div>
    </div>
  );
}