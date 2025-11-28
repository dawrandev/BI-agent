import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Layout/Header";
import LoginModal from "./components/Auth/LoginModal";
import ChatMessage from "./components/Chat/ChatMessage";
import ThinkingIndicator from "./components/Chat/ThinkingIndicator";
import ApiService from "./services/api";
import "./styles/markdown.css";

const API_BASE_URL = "https://localagent.diyarbek.uz";

const initialConfigFormState = {
  odoo_url: "",
  odoo_db: "",
  odoo_username: "",
  odoo_password: "",
  telegram_bot_token: "",
  openai_api_key: "",
  is_active: true,
  auto_start: false,
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [token, setToken] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [error, setError] = useState("");
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [config, setConfig] = useState(null);
  const [configForm, setConfigForm] = useState(initialConfigFormState);
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, thinkingSteps]);

  // Token ni localStorage dan yuklash
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUsername = localStorage.getItem("username");
    if (savedToken && savedUsername) {
      setToken(savedToken);
      setUsername(savedUsername);
      setIsLoggedIn(true);
      loadSessions(savedToken);
      loadConfig(savedToken);
    }
  }, []);

  // Login qilish
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login xato. Username yoki parol noto'g'ri.");
      }

      const data = await response.json();
      setToken(data.access);
      setIsLoggedIn(true);
      setShowAuthModal(false);

      localStorage.setItem("token", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("username", username);

      loadSessions(data.access);
      loadConfig(data.access);
    } catch (err) {
      setError(err.message || "Login xato. Iltimos, qaytadan urinib ko'ring.");
      console.error("Login error:", err);
    }
  };

  // Register qilish
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          password_confirm: passwordConfirm,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Registration failed");
      }

      await handleLogin(e);
    } catch (err) {
      setError(err.message);
    }
  };

  // Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken(null);
    setUsername("");
    setPassword("");
    setEmail("");
    setPasswordConfirm("");
    setSessions([]);
    setCurrentSessionId(null);
    setMessages([]);
    setConfig(null);
    setConfigForm(initialConfigFormState);
    setShowConfigModal(false);
    localStorage.clear();
  };

  // Sessiyalarni yuklash
  const loadSessions = async (authToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/sessions/`, {
        headers: {
          Authorization: `Bearer ${authToken || token}`,
        },
      });

      if (!response.ok) throw new Error("Sessiyalarni yuklashda xatolik");

      const data = await response.json();
      setSessions(data);

      if (data.length > 0 && !currentSessionId) {
        selectSession(data[0].id, authToken);
      }
    } catch (err) {
      console.error("Load sessions error:", err);
    }
  };

  const loadConfig = async (authToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/config/me/`, {
        headers: { Authorization: `Bearer ${authToken || token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setConfig(data);
        setConfigForm({
          odoo_url: data.odoo_url || "",
          odoo_db: data.odoo_db || "",
          odoo_username: data.odoo_username || "",
          odoo_password: "",
          telegram_bot_token: "",
          openai_api_key: "",
          is_active: data.is_active || false,
          auto_start: data.auto_start || false,
        });
      }
    } catch (err) {
      console.error("Load config error:", err);
    }
  };

  const handleConfigSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const method = config ? "PATCH" : "POST";
      const url = config
        ? `${API_BASE_URL}/api/v1/config/${config.id}/`
        : `${API_BASE_URL}/api/v1/config/`;

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(configForm),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Configuration save failed");
      }

      const data = await response.json();
      setConfig(data);
      setShowConfigModal(false);
      alert("Configuration saved successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  // Yangi session yaratish
  const createNewSession = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/sessions/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `New Chat ${sessions.length + 1}`,
        }),
      });

      if (!response.ok) throw new Error("Session yaratishda xatolik");

      const newSession = await response.json();
      setSessions([newSession, ...sessions]);
      setCurrentSessionId(newSession.id);
      setMessages([]);
    } catch (err) {
      console.error("Create session error:", err);
      setError("Yangi chat ochishda xatolik");
    }
  };

  // Sessionni tanlash
  const selectSession = async (sessionId, authToken) => {
    setCurrentSessionId(sessionId);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/sessions/${sessionId}/`,
        {
          headers: {
            Authorization: `Bearer ${authToken || token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Session yuklashda xatolik");

      const data = await response.json();
      const normalizedMessages = (data.messages || []).map((msg) => {
        const files = msg.files || msg.file_paths || [];
        return {
          ...msg,
          files,
          file_paths: msg.file_paths || files,
        };
      });
      setMessages(normalizedMessages);
    } catch (err) {
      console.error("Select session error:", err);
      setMessages([]);
    }
  };

  // Sessionni o'chirish
  const deleteSession = async (sessionId, e) => {
    e.stopPropagation();

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/sessions/${sessionId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Session o'chirishda xatolik");

      const updatedSessions = sessions.filter((s) => s.id !== sessionId);
      setSessions(updatedSessions);

      if (currentSessionId === sessionId) {
        if (updatedSessions.length > 0) {
          selectSession(updatedSessions[0].id);
        } else {
          setCurrentSessionId(null);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error("Delete session error:", err);
      setError("Chat o'chirishda xatolik");
    }
  };

  // Xabar yuborish with SSE streaming
  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: messageText,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setIsStreaming(true);
    setStreamingContent("");
    setThinkingSteps([]);
    setError("");

    try {
      let accumulatedContent = "";

      // Streaming callback handler
      const handleChunk = (chunk) => {
        if (chunk.type === "content") {
          // Accumulate streaming content for real-time display
          accumulatedContent += chunk.content;
          setStreamingContent(accumulatedContent);
          console.log("📨 Streaming chunk:", chunk.content);
        } else if (chunk.type === "thinking") {
          setThinkingSteps((prev) => {
            const existingIndex =
              chunk.stepNumber != null
                ? prev.findIndex((step) => step.stepNumber === chunk.stepNumber)
                : -1;

            if (existingIndex !== -1) {
              const updated = [...prev];
              updated[existingIndex] = {
                ...updated[existingIndex],
                text:
                  chunk.step || chunk.thinking || updated[existingIndex].text,
              };
              return updated;
            }

            const prevCompleted =
              prev.length > 0
                ? prev.map((step, idx) =>
                    idx === prev.length - 1
                      ? { ...step, completed: true }
                      : step
                  )
                : prev;

            const nextStepNumber = chunk.stepNumber || prevCompleted.length + 1;

            return [
              ...prevCompleted,
              {
                text: chunk.step || chunk.thinking || "Processing...",
                completed: false,
                stepNumber: nextStepNumber,
              },
            ];
          });
          console.log("🧠 Thinking step:", chunk.step || chunk.thinking);
        } else if (chunk.type === "complete") {
          setThinkingSteps((prev) =>
            prev.map((step) => ({ ...step, completed: true }))
          );
          console.log("✅ Analysis complete");
        } else if (chunk.type === "files") {
          console.log("📎 Files received:", chunk.files);
        }
      };

      // Call API with streaming callback
      const data = await ApiService.sendMessage(
        messageText,
        currentSessionId,
        token,
        handleChunk
      );

      console.log("✅ API Response complete:", data);

      if (data.session_id && data.session_id !== currentSessionId) {
        setCurrentSessionId(data.session_id);
        loadSessions(token);
      }

      const filesFromApi = data.files || data.file_paths || [];

      // Use accumulated streaming content, or fall back to response field
      const finalContent = accumulatedContent || data.response || "";

      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: finalContent,
        created_at: new Date().toISOString(),
        files: filesFromApi,
        file_paths: data.file_paths || filesFromApi,
      };

      // Replace temporary streaming message with final message
      setMessages((prev) => [...prev, aiMessage]);
      setStreamingContent("");
      setThinkingSteps([]);
    } catch (err) {
      console.error("Send message error:", err);
      setError("Xabar yuborishda xatolik");
      // Keep the streaming content so user can see what was received before error
    } finally {
      setIsTyping(false);
      setIsStreaming(false);
    }
  };

  // Proper form submit handler — prevents event object being passed to sendMessage
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage || !inputMessage.trim()) return;
    sendMessage(inputMessage);
    setInputMessage("");
  };

  const currentSession = sessions.find((s) => s.id === currentSessionId);

  return (
    <div style={styles.container}>
      {/* Auth Modal */}
      {showAuthModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>
              {isRegisterMode ? "Create Account" : "Login to BI Agent"}
            </h2>
            {error && <div style={styles.error}>{error}</div>}
            <form onSubmit={isRegisterMode ? handleRegister : handleLogin}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.modalInput}
                autoFocus
              />
              {isRegisterMode && (
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.modalInput}
                />
              )}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.modalInput}
              />
              {isRegisterMode && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  style={styles.modalInput}
                />
              )}
              <button type="submit" style={styles.modalButton}>
                {isRegisterMode ? "Register" : "Login"}
              </button>
            </form>
            <div style={styles.toggleAuth}>
              {isRegisterMode ? (
                <span>
                  Already have an account?{" "}
                  <button
                    style={styles.toggleButton}
                    onClick={() => {
                      setIsRegisterMode(false);
                      setError("");
                    }}
                  >
                    Login
                  </button>
                </span>
              ) : (
                <span>
                  Don't have an account?{" "}
                  <button
                    style={styles.toggleButton}
                    onClick={() => {
                      setIsRegisterMode(true);
                      setError("");
                    }}
                  >
                    Register
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {showConfigModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Odoo Configuration</h2>
            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleConfigSubmit}>
              <input
                type="url"
                placeholder="Odoo URL (e.g., https://mycompany.odoo.com)"
                value={configForm.odoo_url}
                onChange={(e) =>
                  setConfigForm({ ...configForm, odoo_url: e.target.value })
                }
                style={styles.modalInput}
              />
              <input
                type="text"
                placeholder="Database Name"
                value={configForm.odoo_db}
                onChange={(e) =>
                  setConfigForm({ ...configForm, odoo_db: e.target.value })
                }
                style={styles.modalInput}
              />
              <input
                type="text"
                placeholder="Odoo Username"
                value={configForm.odoo_username}
                onChange={(e) =>
                  setConfigForm({
                    ...configForm,
                    odoo_username: e.target.value,
                  })
                }
                style={styles.modalInput}
              />
              <input
                type="password"
                placeholder="Odoo Password"
                value={configForm.odoo_password}
                onChange={(e) =>
                  setConfigForm({
                    ...configForm,
                    odoo_password: e.target.value,
                  })
                }
                style={styles.modalInput}
              />
              <input
                type="password"
                placeholder="Telegram Bot Token"
                value={configForm.telegram_bot_token}
                onChange={(e) =>
                  setConfigForm({
                    ...configForm,
                    telegram_bot_token: e.target.value,
                  })
                }
                style={styles.modalInput}
              />
              <input
                type="password"
                placeholder="OpenAI API Key"
                value={configForm.openai_api_key}
                onChange={(e) =>
                  setConfigForm({
                    ...configForm,
                    openai_api_key: e.target.value,
                  })
                }
                style={styles.modalInput}
              />

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  marginBottom: "16px",
                  color: "#cbd5e0",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={configForm.is_active}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        is_active: e.target.checked,
                      })
                    }
                  />
                  Active
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={configForm.auto_start}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        auto_start: e.target.checked,
                      })
                    }
                  />
                  Auto-start
                </label>
              </div>

              <button type="submit" style={styles.modalButton}>
                Save Configuration
              </button>
            </form>

            <button
              style={styles.toggleButton}
              onClick={() => setShowConfigModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div style={styles.sidebar}>
        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoIcon}></div>
          <span style={styles.logoText}>BI Agent</span>
        </div>

        {/* Menu Items */}
        <div style={styles.menu}>
          <button
            style={styles.menuItem}
            onClick={
              isLoggedIn ? createNewSession : () => setShowAuthModal(true)
            }
          >
            <span style={styles.icon}>+</span>
            <span>New Chat</span>
          </button>
          <button
            style={styles.menuItem}
            onClick={() => setShowConfigModal(true)}
          >
            <span style={styles.icon}>⚙️</span>
            <span>Settings</span>
          </button>

          {/* Chat History */}
          {isLoggedIn && sessions.length > 0 ? (
            <div style={styles.chatHistory}>
              {sessions.map((session) => (
                <div
                  key={session.id}
                  style={{
                    ...styles.chatHistoryItem,
                    ...(currentSessionId === session.id
                      ? styles.chatHistoryItemActive
                      : {}),
                  }}
                  onClick={() => selectSession(session.id)}
                >
                  <span style={styles.chatHistoryText}>
                    {session.title || "Untitled Chat"}
                  </span>
                  <button
                    style={styles.deleteButton}
                    onClick={(e) => deleteSession(session.id, e)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.historyText}>
              Please login to see your chat history
            </div>
          )}
        </div>

        {/* User Section */}
        <div style={styles.userSection}>
          {isLoggedIn ? (
            <div style={styles.userButton}>
              <div style={styles.userInfo}>
                <div style={styles.avatar}>
                  {username.substring(0, 2).toUpperCase()}
                </div>
                <span style={styles.userName}>{username}</span>
              </div>
              <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
              </button>
            </div>
          ) : (
            <button
              style={styles.loginButton}
              onClick={() => setShowAuthModal(true)}
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.headerText}>
            {currentSession ? currentSession.title : "BI Agent"}
          </span>
          {isLoggedIn && (
            <div style={styles.statusBadge}>
              <div style={styles.statusDot}></div>
              <span>Connected</span>
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div style={styles.chatArea}>
          {!isLoggedIn ? (
            <div style={styles.welcomeContainer}>
              <h1 style={styles.welcomeTitle}>Welcome to BI Agent</h1>
              <p style={styles.welcomeSubtitle}>Chat with your Odoo ERP data</p>
              <button
                style={styles.startButton}
                onClick={() => setShowAuthModal(true)}
              >
                Get Started
              </button>
            </div>
          ) : !currentSessionId || messages.length === 0 ? (
            <div style={styles.welcomeContainer}>
              <div style={styles.biAgentIcon}>📊</div>
              <h1 style={styles.biAgentTitle}>BI Agent Ready</h1>
              <p style={styles.biAgentSubtitle}>
                Ask questions about your Odoo data. I can analyze sales,
                inventory, customers, and generate reports.
              </p>

              {/* Suggestion Cards */}
              <div style={styles.suggestionCards}>
                <button
                  style={styles.suggestionCard}
                  className="suggestion-card"
                  onClick={() =>
                    setInputMessage(
                      "Give me a business overview with revenue, orders, and trends"
                    )
                  }
                >
                  <div style={styles.cardIcon}>📈</div>
                  <div style={styles.cardTitle}>Business Overview</div>
                  <div style={styles.cardSubtitle}>Revenue, orders, trends</div>
                </button>

                <button
                  style={styles.suggestionCard}
                  className="suggestion-card"
                  onClick={() =>
                    setInputMessage("Show me top customers by revenue")
                  }
                >
                  <div style={styles.cardIcon}>👥</div>
                  <div style={styles.cardTitle}>Top Customers</div>
                  <div style={styles.cardSubtitle}>Customer rankings</div>
                </button>

                <button
                  style={styles.suggestionCard}
                  className="suggestion-card"
                  onClick={() =>
                    setInputMessage(
                      "Check inventory levels and show low stock alerts"
                    )
                  }
                >
                  <div style={styles.cardIcon}>📦</div>
                  <div style={styles.cardTitle}>Inventory Check</div>
                  <div style={styles.cardSubtitle}>Stock levels & alerts</div>
                </button>

                <button
                  style={styles.suggestionCard}
                  className="suggestion-card"
                  onClick={() =>
                    setInputMessage("Generate a PDF executive summary report")
                  }
                >
                  <div style={styles.cardIcon}>📄</div>
                  <div style={styles.cardTitle}>PDF Report</div>
                  <div style={styles.cardSubtitle}>Executive summary</div>
                </button>
              </div>
            </div>
          ) : (
            <div style={styles.messagesContainer}>
              {messages.map((message, index) => (
                <ChatMessage key={message.id || index} message={message} />
              ))}

              {/* Thinking steps ko'rsatish */}
              {isStreaming && thinkingSteps.length > 0 && (
                <ThinkingIndicator
                  steps={thinkingSteps}
                  isAnalyzing={!streamingContent}
                />
              )}

              {/* Streaming content ko'rsatish */}
              {isStreaming && streamingContent && (
                <div style={styles.aiMessageWrapper}>
                  <div style={styles.aiAvatar}>AI</div>
                  <div style={styles.aiMessage}>
                    <div className="markdown-content">{streamingContent}</div>
                  </div>
                </div>
              )}

              {/* Oddiy typing indicator */}
              {isTyping && !isStreaming && (
                <div style={styles.aiMessageWrapper}>
                  <div style={styles.aiAvatar}>AI</div>
                  <div style={styles.aiMessage}>
                    <div style={styles.typingIndicator}>
                      <span style={styles.typingDot}></span>
                      <span style={styles.typingDot}></span>
                      <span style={styles.typingDot}></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        {isLoggedIn && (
          <div style={styles.inputArea}>
            {error && <div style={styles.errorBar}>{error}</div>}
            <form onSubmit={handleSubmit} style={styles.inputForm}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about your business data..."
                style={styles.input}
                disabled={isTyping}
              />
              <button
                type="submit"
                style={styles.sendButton}
                disabled={isTyping}
              >
                <span style={styles.sendIcon}>→</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#0f1419",
    color: "#fff",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  sidebar: {
    width: "280px",
    backgroundColor: "#1a1f2e",
    borderRight: "1px solid #2d3748",
    display: "flex",
    flexDirection: "column",
  },
  logo: {
    padding: "20px",
    borderBottom: "1px solid #2d3748",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoIcon: {
    width: "28px",
    height: "28px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "6px",
  },
  logoText: {
    fontWeight: "700",
    fontSize: "18px",
    letterSpacing: "-0.5px",
  },
  menu: {
    flex: 1,
    padding: "16px",
    overflowY: "auto",
  },
  menuItem: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid #2d3748",
    backgroundColor: "transparent",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    marginBottom: "8px",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  icon: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  historyText: {
    marginTop: "24px",
    padding: "0 16px",
    fontSize: "13px",
    color: "#718096",
    lineHeight: "1.6",
  },
  chatHistory: {
    marginTop: "24px",
  },
  chatHistoryItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    marginBottom: "4px",
    backgroundColor: "transparent",
  },
  chatHistoryItemActive: {
    backgroundColor: "#2d3748",
  },
  chatHistoryText: {
    fontSize: "14px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    flex: 1,
    color: "#cbd5e0",
  },
  deleteButton: {
    background: "none",
    border: "none",
    color: "#718096",
    fontSize: "22px",
    cursor: "pointer",
    padding: "0 4px",
    opacity: 0.6,
    transition: "opacity 0.2s",
  },
  userSection: {
    padding: "16px",
    borderTop: "1px solid #2d3748",
  },
  userButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px",
    borderRadius: "10px",
    backgroundColor: "transparent",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "36px",
    height: "36px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "700",
  },
  userName: {
    fontSize: "14px",
    fontWeight: "500",
  },
  loginButton: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  logoutButton: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2d3748",
    color: "#fff",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: "500",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#0f1419",
  },
  header: {
    height: "70px",
    borderBottom: "1px solid #2d3748",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    backgroundColor: "#1a1f2e",
  },
  headerText: {
    fontWeight: "600",
    fontSize: "16px",
  },
  statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 12px",
    borderRadius: "20px",
    backgroundColor: "#065f46",
    fontSize: "13px",
    color: "#6ee7b7",
    fontWeight: "500",
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#10b981",
  },
  chatArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    padding: "24px",
    backgroundColor: "#0f1419",
  },
  welcomeContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  welcomeTitle: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "12px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  welcomeSubtitle: {
    fontSize: "18px",
    color: "#718096",
    marginBottom: "32px",
  },
  startButton: {
    padding: "14px 40px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
  messagesContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    maxWidth: "900px",
    margin: "0 auto",
    width: "100%",
  },
  userMessageWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    alignItems: "flex-start",
  },
  aiMessageWrapper: {
    display: "flex",
    justifyContent: "flex-start",
    gap: "12px",
    alignItems: "flex-start",
  },
  userMessage: {
    maxWidth: "65%",
    padding: "14px 18px",
    borderRadius: "18px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    fontSize: "15px",
    lineHeight: "1.5",
  },
  aiMessage: {
    maxWidth: "80%",
    padding: "16px 20px",
    borderRadius: "18px",
    backgroundColor: "#1a1f2e",
    border: "1px solid #2d3748",
    color: "#e2e8f0",
    fontSize: "15px",
    lineHeight: "1.6",
  },
  aiAvatar: {
    width: "36px",
    height: "36px",
    minWidth: "36px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "700",
    marginTop: "4px",
  },
  userAvatar: {
    width: "36px",
    height: "36px",
    minWidth: "36px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "700",
    marginTop: "4px",
  },
  messageText: {
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  markdownContent: {
    color: "#e2e8f0",
    lineHeight: "1.7",
  },
  typingIndicator: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
    padding: "4px 0",
  },
  typingDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#718096",
    animation: "typing 1.4s infinite",
  },
  inputArea: {
    padding: "24px 32px",
    borderTop: "1px solid #2d3748",
    backgroundColor: "#1a1f2e",
  },
  inputForm: {
    display: "flex",
    gap: "12px",
    maxWidth: "900px",
    margin: "0 auto",
  },
  input: {
    flex: 1,
    padding: "16px 20px",
    borderRadius: "12px",
    border: "1px solid #2d3748",
    backgroundColor: "#0f1419",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
  },
  sendButton: {
    padding: "16px 28px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "20px",
    fontWeight: "bold",
    transition: "transform 0.2s",
  },
  sendIcon: {
    display: "inline-block",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#1a1f2e",
    padding: "40px",
    borderRadius: "16px",
    border: "1px solid #2d3748",
    minWidth: "420px",
  },
  modalTitle: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "28px",
    textAlign: "center",
  },
  modalInput: {
    width: "100%",
    padding: "16px 20px",
    borderRadius: "12px",
    border: "1px solid #2d3748",
    backgroundColor: "#0f1419",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    marginBottom: "16px",
  },
  modalButton: {
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "16px",
  },
  toggleAuth: {
    textAlign: "center",
    fontSize: "14px",
    color: "#718096",
  },
  toggleButton: {
    background: "none",
    border: "none",
    color: "#667eea",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    textDecoration: "underline",
  },
  error: {
    backgroundColor: "#dc2626",
    color: "#fff",
    padding: "14px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "14px",
    textAlign: "center",
  },
  errorBar: {
    backgroundColor: "#dc2626",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "10px",
    marginBottom: "16px",
    fontSize: "14px",
    textAlign: "center",
  },

  // Existing styles ichiga qo'shing
  biAgentIcon: {
    fontSize: "64px",
    marginBottom: "16px",
  },
  biAgentTitle: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "12px",
    color: "#fff",
  },
  biAgentSubtitle: {
    fontSize: "16px",
    color: "#9ca3af",
    marginBottom: "40px",
    maxWidth: "600px",
    lineHeight: "1.6",
  },
  suggestionCards: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
    maxWidth: "700px",
    width: "100%",
  },
  suggestionCard: {
    backgroundColor: "#1a1f2e",
    border: "1px solid #2d3748",
    borderRadius: "12px",
    padding: "20px",
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    color: "#fff",
  },
  cardIcon: {
    fontSize: "28px",
    marginBottom: "4px",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#fff",
  },
  cardSubtitle: {
    fontSize: "13px",
    color: "#9ca3af",
  },
};

export default App;
