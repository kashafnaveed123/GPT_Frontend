import React, { useEffect, useRef, useState } from "react";
import { Send, Paperclip, Mic, RefreshCw, AlertCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/ApiCalls";
import RightMain from './rightSide/RightMain';
import profile from '../assests/profile.png'

const COLORS = {
  primary: "#C026D3",
  accent: "#EC4899",
  bg: "#FDF2F8",
  card: "#FFFFFF",
  subtle: "#9D174D",
};

const WELCOME_MESSAGE = {
  id: 'welcome',
  who: "bot",
  text: "🎀 Hello! I'm Kashaf's GPT — AI assistant to introduce kashaf's tech. How can I support you today?",
  time: new Date().toISOString(),
};

export default function ChatbotUI({
  title = "Kashaf GPT",
  subtitle = "Professional Mern AI Developer",
  currentChatId = null,
  onChatIdChange = () => { },
  onChatUpdated = () => { },
}) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [queryLimits, setQueryLimits] = useState(null);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [localChatId, setLocalChatId] = useState(currentChatId);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const endRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Load query limits on mount
  useEffect(() => {
    loadQueryLimits();
  }, [user]);

  // Load chat history when currentChatId changes
  useEffect(() => {
    if (currentChatId && currentChatId !== localChatId) {
      loadChatHistory(currentChatId);
    } else if (!currentChatId && localChatId) {
      // Reset to welcome message when starting new chat
      setMessages([WELCOME_MESSAGE]);
      setLocalChatId(null);
    }
  }, [currentChatId]);

  useEffect(() => {
    if (isInitialLoad) {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = 0;
      }
      setIsInitialLoad(false);
    }
  }, [messages, isInitialLoad]);

// Auto-scroll chat container to bottom when new messages arrive
// Auto-scroll chat container to bottom when new messages arrive (smooth)
useEffect(() => {
  if (!isInitialLoad && !isLoadingHistory && chatContainerRef.current) {
    chatContainerRef.current.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }
}, [messages, isInitialLoad, isLoadingHistory]);
  // Load chat messages from backend
  const loadChatHistory = async (chatId) => {
    if (!user || !chatId) return;

    try {
      setIsLoadingHistory(true);
      toast.loading('Loading chat history...', { id: 'load-chat' });

      const chatMessages = await API.chats.getMessages(chatId);

      if (!chatMessages || chatMessages.length === 0) {
        setMessages([WELCOME_MESSAGE]);
        toast.success('Chat loaded (empty)', { id: 'load-chat' });
        return;
      }

      // Convert backend messages to UI format
      const formattedMessages = chatMessages.map((msg, index) => ({
        id: msg.id || `msg_${index}`,
        who: msg.role === 'user' ? 'user' : 'bot',
        text: msg.content,
        meta: msg.sources?.map(s => s.source) || [],
        time: msg.timestamp,
      }));

      setMessages(formattedMessages);
      setLocalChatId(chatId);

      toast.success('Chat loaded successfully!', { id: 'load-chat' });

      // Scroll to bottom after loading
      // setTimeout(() => {
      //   endRef.current?.scrollIntoView({ behavior: "smooth" });
      // }, 100);

    } catch (error) {
      console.error('Failed to load chat history:', error);
      toast.error('Failed to load chat history', { id: 'load-chat' });

      // On error, show welcome message
      setMessages([{
        id: Date.now(),
        who: "bot",
        text: "⚠️ Failed to load chat history. Starting fresh conversation.",
        time: new Date().toISOString(),
        isError: true,
      }]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const loadQueryLimits = async () => {
    try {
      const limits = await API.limits.getLimits();
      setQueryLimits(limits);

      if (limits.remaining <= 1) {
        setShowLimitWarning(true);
      }
    } catch (error) {
      console.error("Failed to load query limits:", error);
    }
  };

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isSending) return;

    // Check if limit exceeded
    if (queryLimits && !queryLimits.allowed) {
      toast.error(queryLimits.message || 'Query limit exceeded');
      setMessages((m) => [
        ...m,
        {
          id: Date.now(),
          who: "bot",
          text: `⚠️ ${queryLimits.message}`,
          isError: true,
          time: new Date().toISOString(),
        },
      ]);
      return;
    }

    const userMsg = {
      id: Date.now(),
      who: "user",
      text,
      time: new Date().toISOString()
    };

    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsSending(true);

    const sendToast = toast.loading('Sending your message...');

    try {
      // If user is authenticated and we don't have a chat ID, create one
      let activeChatId = localChatId;

      if (user && !activeChatId) {
        toast.loading('Creating new chat...', { id: sendToast });

        const newChat = await API.chats.create("New Chat", text);
        activeChatId = newChat.id;
        setLocalChatId(activeChatId);

        if (onChatIdChange) {
          onChatIdChange(activeChatId);
        }
      }

      // Use smart query with chat ID if authenticated
      const response = await API.chat.smartQuery(text, 1, activeChatId);

      // Check if limit exceeded in response
      if (response.limit_exceeded) {
        toast.error('Query limit exceeded!', { id: sendToast });

        const botMsg = {
          id: Date.now() + 1,
          who: "bot",
          text: `⚠️ ${response.answer}`,
          isError: true,
          limitInfo: response.limit_info,
          time: new Date().toISOString(),
        };
        setMessages((m) => [...m, botMsg]);
        setQueryLimits(response.limit_info);
        return;
      }

      const botMsg = {
        id: Date.now() + 1,
        who: "bot",
        text: response.answer || "(no response)",
        meta: response.sources?.map(s => s.source) || [],
        limitInfo: response.limit_info,
        time: new Date().toISOString(),
      };

      setMessages((m) => [...m, botMsg]);

      toast.success('Response received!', { id: sendToast });

      // Update query limits
      if (response.limit_info) {
        setQueryLimits(response.limit_info);

        if (response.limit_info.remaining <= 1) {
          setShowLimitWarning(true);
        }
      }

      // Update chat ID if returned
      if (response.chat_id && response.chat_id !== activeChatId) {
        setLocalChatId(response.chat_id);
        if (onChatIdChange) {
          onChatIdChange(response.chat_id);
        }
      }

      // Notify that chat was updated
      if (activeChatId && onChatUpdated) {
        onChatUpdated(activeChatId);
      }

      // Reload limits
      await loadQueryLimits();

    } catch (err) {
      console.error("Query error:", err);

      let errorMessage = "⚠️ Something went wrong. Please try again.";

      if (err.message.includes("limit")) {
        errorMessage = `⚠️ ${err.message}`;
      } else if (err.message.includes("network")) {
        errorMessage = "⚠️ Network error. Please check your connection.";
      } else if (err.message.includes("401")) {
        errorMessage = "⚠️ Session expired. Please login again.";
      }

      toast.error(errorMessage.replace('⚠️ ', ''), { id: sendToast });

      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 2,
          who: "bot",
          text: errorMessage,
          isError: true,
          time: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function clearChat() {
    toast.success('Chat cleared! Starting fresh conversation.');

    setMessages([WELCOME_MESSAGE]);
    setShowLimitWarning(false);
    setLocalChatId(null);

    if (onChatIdChange) {
      onChatIdChange(null);
    }
  }

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div
      className="min-h-screen flex items-start justify-center p-2 sm:p-4 md:p-6 lg:p-8"
      style={{
        background: "linear-gradient(135deg, #FCE7F3 0%, #F3E8FF 100%)",
      }}
    >
      <div className="w-full max-w-sm sm:max-w-[90%] md:max-w-xl lg:max-w-7xl flex flex-col lg:flex-row gap-4 md:gap-6 sm:gap-2">

        {/* Chat UI Section */}
        <div className="flex-1 w-full lg:w-auto">
          <div
            className="rounded-xl shadow-2xl overflow-hidden backdrop-blur-lg border transition-all"
            style={{
              background: COLORS.card,
              borderColor: "rgba(236, 72, 153, 0.15)",
            }}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-pink-100 gap-3 sm:gap-0">
              <div className="flex items-center gap-3 sm:gap-4">

                <img
                  src={profile}
                  alt="Kashaf Naveed"
                  className="w-12 h-12 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full object-cover border-4 border-pink-200 shadow-lg"
                />

                <div className="text-center sm:text-left">
                  <div className="text-gray-800 text-base sm:text-lg font-semibold">{title}</div>
                  <div className="text-xs sm:text-sm text-pink-500">{subtitle}</div>
                </div>
              </div>

              <button
                onClick={clearChat}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium text-white shadow-md hover:shadow-lg transition-all"
                style={{
                  background: "linear-gradient(135deg, #EC4899, #C026D3)",
                }}
              >
                <RefreshCw size={16} /> New
              </button>
            </div>

            {/* Query Limit Display */}
            {queryLimits && (
              <div className="px-4 sm:px-6 py-2 bg-pink-50 border-b border-pink-100">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <Info size={14} className="text-pink-600" />
                    <span className="text-gray-700">
                      {user ? (
                        <span>Queries: <strong>{queryLimits.current}/{queryLimits.limit}</strong></span>
                      ) : (
                        <span>Guest Mode: <strong>{queryLimits.current}/{queryLimits.limit}</strong> queries</span>
                      )}
                    </span>
                  </div>
                  {!user && queryLimits.remaining > 0 && (
                    <button
                      onClick={handleLoginRedirect}
                      className="text-pink-600 font-semibold hover:text-pink-700 underline"
                    >
                      Login for 5 queries/day
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Limit Warning */}
            {showLimitWarning && queryLimits && queryLimits.remaining <= 1 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="px-4 sm:px-6 py-3 bg-yellow-50 border-b border-yellow-200"
              >
                <div className="flex items-start gap-2 text-xs sm:text-sm text-yellow-800">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">
                      {queryLimits.remaining === 0
                        ? "Query limit reached!"
                        : `Only ${queryLimits.remaining} query remaining today!`
                      }
                    </p>
                    {!user && (
                      <p className="mt-1">
                        <button
                          onClick={handleLoginRedirect}
                          className="text-pink-600 font-semibold hover:underline"
                        >
                          Login
                        </button>
                        {" "}to get 5 queries per day instead of 3.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Chat Area */}
            <div
              ref={chatContainerRef}
              className="h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[55vh] overflow-y-auto p-3 md:p-6 space-y-3 sm:space-y-4 bg-gradient-to-b from-white to-pink-50/60"
            >
              {isLoadingHistory ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent mb-2"></div>
                    <p className="text-sm text-gray-600">Loading chat history...</p>
                  </div>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {messages.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      {m.who === "user" ? (
                        <div className="flex justify-end">
                          <div
                            className="max-w-[85%] sm:max-w-[75%] px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base font-medium text-white shadow-md"
                            style={{
                              background: "linear-gradient(135deg, #C026D3, #EC4899)",
                            }}
                          >
                            {m.text}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2 sm:gap-3">
                          {/* <div
                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white font-medium shadow-md flex-shrink-0"
                            style={{
                              background: "linear-gradient(135deg, #EC4899, #C026D3)",
                            }}
                          >
                            K
                          </div> */}
                          <img
                            src={profile}
                            alt="Kashaf Naveed"
                            className="w-14 h-14 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-pink-200 shadow-lg"
                          />
                          <div className={`max-w-[85%] px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm sm:text-base shadow-sm border ${m.isError
                              ? 'bg-red-50 text-red-800 border-red-200'
                              : 'bg-pink-50 text-gray-800 border-pink-100'
                            }`}>
                            <div className="whitespace-pre-wrap leading-relaxed">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {m.text}
                              </ReactMarkdown>
                            </div>
                            {m.meta && m.meta.length > 0 && (
                              <div className="mt-2 text-xs text-pink-600 font-medium">
                                 Sources: {m.meta.slice(0, 3).join(", ")}
                                {m.meta.length > 3 ? "..." : ""}
                              </div>
                            )}
                            {m.limitInfo && !m.isError && (
                              <div className="mt-2 pt-2 border-t border-pink-200 text-xs text-gray-600">
                                Remaining queries: {m.limitInfo.remaining}/{m.limitInfo.limit}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}

              {isSending && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-2 sm:gap-3"
                >
                  <div
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white font-medium shadow-md flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #EC4899, #C026D3)",
                    }}
                  >
                    K
                  </div>
                  <div className="max-w-[85%] px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm sm:text-base bg-pink-50 text-gray-800 shadow-sm border border-pink-100">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                      <span className="text-gray-600">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input Section */}
            <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-pink-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur">
              <div className="flex items-center gap-2 p-2 rounded-md bg-pink-50 border border-pink-100 flex-1">
                <button
                  type="button"
                  className="p-1.5 sm:p-2 text-sm rounded-sm hover:bg-pink-100 transition-all"
                  disabled
                >
                  <Paperclip size={16} className="text-pink-400" />
                </button>

                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  placeholder={
                    queryLimits && !queryLimits.allowed
                      ? "Daily limit reached..."
                      : "Ask anything about Kashaf..."
                  }
                  disabled={isSending || (queryLimits && !queryLimits.allowed) || isLoadingHistory}
                  className="bg-transparent outline-none text-gray-700 placeholder:text-pink-400 flex-1 text-sm sm:text-base py-1.5 sm:py-2 disabled:opacity-50"
                />

                <button
                  type="button"
                  className="p-1.5 sm:p-2 rounded-md hover:bg-pink-100 transition-all"
                  disabled
                >
                  <Mic size={16} className="text-pink-400" />
                </button>
              </div>

              <button
                onClick={handleSend}
                disabled={isSending || !input.trim() || (queryLimits && !queryLimits.allowed) || isLoadingHistory}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #EC4899, #C026D3)",
                }}
              >
                {isSending ? "Thinking..." : "Send"} <Send size={16} />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-2 sm:mt-3 text-center text-xs sm:text-sm text-pink-600 font-medium">
            {user ? (
              <span>✨ Logged in as {user.name || user.full_name} - 5 queries/day</span>
            ) : (
              <span>👋 Guest mode - 3 queries/day • <button onClick={handleLoginRedirect} className="underline hover:text-pink-700">Login for more</button></span>
            )}
          </div>
        </div>

        {/* RIGHT MAIN */}
        <div className="w-full lg:w-80 xl:w-96">
          <RightMain />
        </div>

      </div>
    </div>
  );
}