import React, { useState } from 'react';
import { X, Plus, MessageSquare, LogOut, Trash2, Menu, Pin, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const COLORS = {
  primary: "#C026D3",
  accent: "#EC4899",
  bg: "#FDF2F8",
  card: "#FFFFFF",
};

export default function Sidebar({ 
  isOpen = false, 
  onToggle = () => {}, 
  chatHistory = {},
  currentChatId,
  onSelectChat = () => {},
  onNewChat = () => {},
  onDeleteChat = () => {},
  onPinChat = () => {},
  onRenameChat = () => {},
  onLogout = () => {},
  userName = "User",
  onMenuClick = () => {}
}) {
  const [hoveredChat, setHoveredChat] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const navigate = useNavigate();
  const { logout: authLogout, user } = useAuth();

  const displayName = user?.name || user?.full_name || userName;

  // Handle logout
  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      toast.loading('Logging out...', { id: 'logout' });

      if (onLogout && typeof onLogout === 'function') {
        onLogout();
      }

      authLogout();
      toast.success('Logged out successfully!', { id: 'logout' });
      navigate('/login');

    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed', { id: 'logout' });
      authLogout();
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get all chats as flat array
  const getAllChatsArray = () => {
    if (Array.isArray(chatHistory)) return chatHistory;
    return Object.values(chatHistory).flat();
  };

  // Handle rename start
  const handleStartRename = (chat, e) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditTitle(chat.title || 'Untitled Chat');
  };

  // Handle rename finish with Enter or Check button
  const handleFinishRename = async (chatId, e) => {
    if (e) e.stopPropagation();
    
    const currentChat = getAllChatsArray().find(c => c.id === chatId);
    const newTitle = editTitle.trim();
    
    // Cancel if no change or empty
    if (!newTitle || newTitle === currentChat?.title) {
      setEditingChatId(null);
      return;
    }

    try {
      toast.loading('Renaming chat...', { id: 'rename-chat' });
      
      await onRenameChat(chatId, newTitle);
      
      toast.success('Chat renamed successfully!', { id: 'rename-chat' });
      setEditingChatId(null);
      
    } catch (error) {
      console.error('Rename error:', error);
      toast.error('Failed to rename chat', { id: 'rename-chat' });
    }
  };

  // Handle delete with confirmation
  const handleDelete = async (chatId, e) => {
    e.stopPropagation();
    
    const chat = getAllChatsArray().find(c => c.id === chatId);
    const chatTitle = chat?.title || 'this chat';
    
    // if (!window.confirm(`Are you sure you want to delete "${chatTitle}"?`)) {
    //   return;
    // }

    try {
      toast.loading('Deleting chat...', { id: 'delete-chat' });
      
      await onDeleteChat(chatId);
      
      toast.success('Chat deleted successfully!', { id: 'delete-chat' });
      
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete chat', { id: 'delete-chat' });
    }
  };

  // Handle pin/unpin
  const handlePin = async (chatId, shouldPin, e) => {
    e.stopPropagation();
    
    try {
      toast.loading(shouldPin ? 'Pinning chat...' : 'Unpinning chat...', { id: 'pin-chat' });
      
      await onPinChat(chatId, shouldPin);
      
      toast.success(shouldPin ? 'Chat pinned!' : 'Chat unpinned!', { id: 'pin-chat' });
      
    } catch (error) {
      console.error('Pin error:', error);
      toast.error('Failed to update pin status', { id: 'pin-chat' });
    }
  };

  // Flatten and group chat history
  const flattenChatHistory = () => {
    if (Array.isArray(chatHistory)) {
      return groupChatsByDate(chatHistory);
    }
    return chatHistory;
  };

  const groupChatsByDate = (chats) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const groups = {
      Today: [],
      Yesterday: [],
      'Last 7 Days': [],
      Older: []
    };

    chats.forEach(chat => {
      const chatDate = new Date(chat.date || chat.updated_at || chat.created_at);
      const dateStr = chatDate.toDateString();
      
      if (dateStr === today.toDateString()) {
        groups.Today.push(chat);
      } else if (dateStr === yesterday.toDateString()) {
        groups.Yesterday.push(chat);
      } else if (chatDate > weekAgo) {
        groups['Last 7 Days'].push(chat);
      } else {
        groups.Older.push(chat);
      }
    });

    return groups;
  };

  const groups = flattenChatHistory();

  const Tooltip = ({ text, children }) => {
    return (
      <div className="relative group">
        {children}
        <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
          {text}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
        </div>
      </div>
    );
  };

  const ChatGroup = ({ title, chats }) => {
    if (!chats || chats.length === 0) return null;

    return (
      <div className="mb-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xs font-semibold text-pink-400 uppercase tracking-wide px-4 mb-2">
          {title}
        </h3>
        <div className="space-y-1">
          {chats.map(chat => (
            <div
              key={chat.id}
              className={`
                relative group mx-2 rounded-lg transition-all cursor-pointer
                ${currentChatId === chat.id 
                  ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white' 
                  : 'hover:bg-pink-50 text-gray-700'
                }
              `}
              onClick={() => {
                if (editingChatId !== chat.id) {
                  onSelectChat(chat.id);
                }
              }}
              onMouseEnter={() => setHoveredChat(chat.id)}
              onMouseLeave={() => setHoveredChat(null)}
            >
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="flex items-center gap-2 flex-shrink-0">
                  {chat.is_pinned && (
                    <Pin size={12} className={currentChatId === chat.id ? 'text-white' : 'text-pink-500'} />
                  )}
                  <MessageSquare size={16} className={currentChatId === chat.id ? 'text-white' : 'text-pink-500'} />
                </div>
                
                <div className="flex-1 min-w-0">
                  {editingChatId === chat.id ? (
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => handleFinishRename(chat.id)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleFinishRename(chat.id, e);
                          }
                        }}
                        className="flex-1 px-2 py-1 text-sm border border-pink-300 rounded focus:outline-none focus:border-pink-500 text-gray-800"
                        autoFocus
                      />
                      <button
                        onClick={(e) => handleFinishRename(chat.id, e)}
                        className="p-1 rounded bg-pink-500 text-white hover:bg-pink-600 transition-colors flex-shrink-0"
                        title="Save"
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium truncate">
                        {chat.title || 'Untitled Chat'}
                      </p>
                      <p className={`text-xs truncate ${currentChatId === chat.id ? 'text-pink-100' : 'text-gray-500'}`}>
                        {chat.preview || 'No messages yet'}
                      </p>
                    </>
                  )}
                </div>

                {hoveredChat === chat.id && editingChatId !== chat.id && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={(e) => handleStartRename(chat, e)}
                      className={`p-1 rounded hover:bg-pink-200 transition-colors ${
                        currentChatId === chat.id ? 'text-white hover:bg-pink-400' : 'text-pink-600'
                      }`}
                      title="Rename"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                        <path d="m15 5 4 4"/>
                      </svg>
                    </button>
                    
                    <button
                      onClick={(e) => handlePin(chat.id, !chat.is_pinned, e)}
                      className={`p-1 rounded hover:bg-pink-200 transition-colors ${
                        currentChatId === chat.id ? 'text-white hover:bg-pink-400' : 'text-pink-600'
                      }`}
                      title={chat.is_pinned ? "Unpin" : "Pin"}
                    >
                      <Pin size={14} className={chat.is_pinned ? 'fill-current' : ''} />
                    </button>

                    <button
                      onClick={(e) => handleDelete(chat.id, e)}
                      className={`p-1 rounded hover:bg-pink-200 transition-colors ${
                        currentChatId === chat.id ? 'text-white hover:bg-pink-400' : 'text-pink-600'
                      }`}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Collapsed sidebar
  if (!isOpen) {
    return (
      <>
        {/* Small screen - Only Menu Button */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <button 
            className="p-2 rounded-lg bg-white shadow-lg hover:bg-pink-50 transition-all border border-pink-100"
            onClick={onMenuClick}
          >
            <Menu size={20} className="text-pink-600" />
          </button>
        </div>

        {/* Medium and Large screens - Full collapsed sidebar */}
        <div className="hidden md:block fixed lg:sticky top-0 left-0 h-screen z-50 bg-white shadow-2xl border-r border-pink-100 md:w-16 lg:w-20">
          <div className="h-full flex flex-col items-center py-5 lg:py-6 gap-5 lg:gap-6">
            <Tooltip text='Expand'>
              <button 
                className="p-2 rounded-lg hover:bg-pink-100 transition-all"
                onClick={onMenuClick}
              >
                <Menu size={20} className="text-pink-600" />
              </button>
            </Tooltip>
            
            <Tooltip text={displayName}>
              <div
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-white font-bold shadow-md cursor-pointer hover:scale-110 transition-transform text-sm lg:text-base"
                style={{
                  background: "linear-gradient(135deg, #EC4899, #C026D3)",
                }}
                onClick={onToggle}
              >
                {displayName.charAt(0).toUpperCase()}
              </div>
            </Tooltip>

            <Tooltip text="New Chat">
              <button
                onClick={onNewChat}
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center border-2 border-pink-500 text-pink-500 hover:bg-pink-50 hover:scale-110 transition-all shadow-md"
              >
                <Plus size={22} className="lg:w-6 lg:h-6" />
              </button>
            </Tooltip>

            <div className="flex-1"></div>

            <Tooltip text="Logout">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-white shadow-md hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #EC4899, #C026D3)",
                }}
              >
                {isLoggingOut ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                      fill="none"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <LogOut size={18} className="lg:w-5 lg:h-5" />
                )}
              </button>
            </Tooltip>
          </div>
        </div>
      </>
    );
  }

  // Full sidebar
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
            isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:sticky top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '280px' }}
      >
        <div className="h-screen flex flex-col bg-white shadow-2xl border-r border-pink-100">
          {/* Header */}
          <div className="p-4 border-b border-pink-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                  style={{
                    background: "linear-gradient(135deg, #EC4899, #C026D3)",
                  }}
                >
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{displayName}</p>
                  <p className="text-xs text-pink-500">
                    {user ? 'Online' : 'Guest Mode'}
                  </p>
                </div>
              </div>
              <button
                onClick={onToggle}
                className="p-2 hover:bg-pink-50 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* New Chat Button */}
            <button
              onClick={onNewChat}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-semibold hover:shadow-lg transition-all"
              style={{
                color: '#ec4899',
                border:'2px solid #ec4899'
              }}
            >
              <Plus size={18} />
              New Chat
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto py-4">
            {Object.keys(groups).length === 0 || Object.values(groups).every(arr => arr.length === 0) ? (
              <div className="px-4 py-8 text-center">
                <MessageSquare size={48} className="mx-auto text-pink-200 mb-3" />
                <p className="text-sm text-gray-500">No chat history yet</p>
                <p className="text-xs text-gray-400 mt-1">Start a new conversation</p>
              </div>
            ) : (
              <>
                {Object.entries(groups).map(([category, chats]) => (
                  <ChatGroup key={category} title={category} chats={chats} />
                ))}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-pink-100">
            {user ? (
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #EC4899, #C026D3)",
                }}
              >
                {isLoggingOut ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                        fill="none"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut size={18} />
                    Logout
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
                style={{
                  background: "linear-gradient(135deg, #EC4899, #C026D3)",
                }}
              >
                <LogOut size={18} />
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}