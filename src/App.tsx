import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import AppHeader from './components/Layout/AppHeader';
import AuthModal from './components/Modals/AuthModal';
import SettingsPage from './components/Settings/SettingsPage';
import WelcomeScreen from './components/Landing/WelcomeScreen';
import EmptyState from './components/Landing/EmptyState';
import ChatView from './components/Chat/ChatView';
import MessageInput from './components/Chat/MessageInput';
import ApiService from './services/api';
import {
  Message,
  Session,
  StreamChunk,
  AgentConfig,
  ConfigFormData,
  DatabaseConfig,
  CustomInstructions,
  API_BASE_URL,
  INITIAL_CONFIG_FORM,
} from './types';
import './index.css';

function ChatApp() {
  const navigate = useNavigate();
  const { sessionId: urlSessionId } = useParams<{ sessionId: string }>();

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [token, setToken] = useState<string | null>(null);

  // Session state
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  // UI state
  const [isTyping, setIsTyping] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Streaming state
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState<StreamChunk[]>([]);


  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, thinkingSteps, scrollToBottom]);

  // Load token from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');
    if (savedToken && savedUsername) {
      setToken(savedToken);
      setUsername(savedUsername);
      setIsLoggedIn(true);
    }
    setInitialLoadDone(true);
  }, []);

  // Load sessions when logged in
  useEffect(() => {
    if (isLoggedIn && token && initialLoadDone) {
      loadSessions(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, token, initialLoadDone]);

  // Handle URL session ID changes
  useEffect(() => {
    if (initialLoadDone && isLoggedIn && token) {
      if (urlSessionId) {
        if (urlSessionId !== currentSessionId) {
          selectSession(urlSessionId, token);
        }
      } else if (currentSessionId) {
        setCurrentSessionId(null);
        setMessages([]);
        setThinkingSteps([]);
        setStreamingContent('');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSessionId, initialLoadDone, isLoggedIn, token, currentSessionId]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Login xato. Username yoki parol noto'g'ri.");
      }

      const data = await response.json();
      setToken(data.access);
      setIsLoggedIn(true);
      setShowAuthModal(false);

      localStorage.setItem('token', data.access);
      localStorage.setItem('refresh', data.refresh);
      localStorage.setItem('username', username);

      loadSessions(data.access);
    } catch (err) {
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError("Backend serverga ulanib bo'lmadi. Server ishlab turibdimi tekshiring.");
      } else if (err instanceof Error) {
        setError(err.message || "Login xato. Iltimos, qaytadan urinib ko'ring.");
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
          password_confirm: passwordConfirm,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Registration failed');
      }

      await handleLogin(e);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken(null);
    setUsername('');
    setPassword('');
    setEmail('');
    setPasswordConfirm('');
    setSessions([]);
    setCurrentSessionId(null);
    setMessages([]);
    setThinkingSteps([]);
    setStreamingContent('');
    localStorage.clear();
    navigate('/');
  };

  const loadSessions = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/sessions/`, {
        headers: { Authorization: `Bearer ${authToken || token}` },
      });

      if (!response.ok) throw new Error('Sessiyalarni yuklashda xatolik');

      const data = await response.json();
      setSessions(data);
    } catch (err) {
      console.error('Load sessions error:', err);
    }
  };

  const createNewSession = () => {
    setCurrentSessionId(null);
    setMessages([]);
    setStreamingContent('');
    setThinkingSteps([]);
    setError('');
    navigate('/');
  };

  const selectSession = async (sessionId: string, authToken?: string) => {
    setCurrentSessionId(sessionId);
    setThinkingSteps([]);
    setStreamingContent('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/sessions/${sessionId}/`, {
        headers: { Authorization: `Bearer ${authToken || token}` },
      });

      if (!response.ok) throw new Error('Session yuklashda xatolik');

      const data = await response.json();
      const normalizedMessages: Message[] = (data.messages || []).map((msg: Message) => {
        return {
          ...msg,
          files: msg.files || [],
          thinkingSteps: msg.thinking_steps || [],
        };
      });
      setMessages(normalizedMessages);

      if (window.location.pathname !== `/c/${sessionId}`) {
        navigate(`/c/${sessionId}`, { replace: true });
      }
    } catch (err) {
      console.error('Select session error:', err);
      setMessages([]);
    }
  };

  const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/sessions/${sessionId}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Session o'chirishda xatolik");

      const updatedSessions = sessions.filter((s) => s.id !== sessionId);
      setSessions(updatedSessions);

      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
        setMessages([]);
        navigate('/');
      }
    } catch (err) {
      console.error('Delete session error:', err);
      setError("Chat o'chirishda xatolik");
    }
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: messageText,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setIsStreaming(true);
    setStreamingContent('');
    setThinkingSteps([]);
    setError('');

    try {
      let sessionToUse = currentSessionId;

      if (!sessionToUse) {
        const newSession = await ApiService.createSession(token!, 'New Chat');
        sessionToUse = newSession.id;
        setCurrentSessionId(newSession.id);
        setSessions((prev) => [newSession, ...prev]);
        navigate(`/c/${newSession.id}`, { replace: true });
      }

      let accumulatedContent = '';
      let currentSteps: StreamChunk[] = [];

      const handleChunk = (chunk: StreamChunk) => {
        switch (chunk.type) {
          case 'step_started':
            currentSteps = [
              ...currentSteps,
              { type: chunk.type, step: chunk.step, message: chunk.message, completed: false },
            ];
            setThinkingSteps([...currentSteps]);
            break;

          case 'step_completed':
            currentSteps = currentSteps.map((s) =>
              s.step === chunk.step ? { ...s, completed: true, message: chunk.message } : s
            );
            setThinkingSteps([...currentSteps]);
            break;

          case 'react_thinking':
          case 'react_action':
          case 'react_observation':
          case 'react_finishing':
            currentSteps = [
              ...currentSteps,
              {
                type: chunk.type,
                step: chunk.step,
                message: chunk.message,
                icon: chunk.icon,
                tool: chunk.tool,
                completed: false,
              },
            ];
            setThinkingSteps([...currentSteps]);
            break;

          case 'complete':
            currentSteps = currentSteps.map((s) => ({ ...s, completed: true }));
            setThinkingSteps([...currentSteps]);

            if (chunk.response) {
              accumulatedContent = chunk.response;
              setStreamingContent(chunk.response);
            }

            if (chunk.session_title) {
              setSessions((prev) =>
                prev.map((s) =>
                  s.id === sessionToUse ? { ...s, title: chunk.session_title! } : s
                )
              );
            }
            break;

          default:
            console.log('Unknown chunk type:', chunk.type, chunk);
        }
      };

      const data = await ApiService.sendMessage(messageText, sessionToUse, token!, handleChunk);

      if (data.session_id && data.session_id !== sessionToUse) {
        setCurrentSessionId(data.session_id);
        navigate(`/c/${data.session_id}`, { replace: true });
        loadSessions(token!);
      }

      const filesFromApi = data.files || [];
      const finalContent = accumulatedContent || data.response || '';

      const aiMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: finalContent,
        created_at: new Date().toISOString(),
        files: filesFromApi,
        thinkingSteps: [...currentSteps],
      };

      setMessages((prev) => [...prev, aiMessage]);
      setStreamingContent('');
    } catch (err) {
      console.error('Send message error:', err);
      setError('Xabar yuborishda xatolik');
    } finally {
      setIsTyping(false);
      setIsStreaming(false);
    }
  };

  const handleSendMessage = (messageText: string) => {
    if (!messageText || !messageText.trim()) return;
    sendMessage(messageText);
    setInputMessage('');
  };

  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const showEmptyState = isLoggedIn && (!currentSessionId || messages.length === 0);

  return (
    <div className="flex h-screen bg-primary text-text-primary font-sans">
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        isRegisterMode={isRegisterMode}
        error={error}
        username={username}
        password={password}
        email={email}
        passwordConfirm={passwordConfirm}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
        onEmailChange={setEmail}
        onPasswordConfirmChange={setPasswordConfirm}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onToggleMode={() => {
          setIsRegisterMode(!isRegisterMode);
          setError('');
        }}
      />

      {/* Sidebar */}
      <Sidebar
        isLoggedIn={isLoggedIn}
        username={username}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onNewChat={isLoggedIn ? createNewSession : () => setShowAuthModal(true)}
        onSelectSession={(id) => selectSession(id)}
        onDeleteSession={deleteSession}
        onLogin={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onSettings={() => navigate('/settings')}
        isOpen={sidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-primary">
        {/* Header */}
        <AppHeader
          title={currentSession?.title || 'BI Agent'}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Chat Area */}
        <div
          className={`flex-1 flex flex-col overflow-y-auto bg-primary ${
            showEmptyState ? 'justify-center items-center' : ''
          }`}
        >
          {!isLoggedIn ? (
            <WelcomeScreen onGetStarted={() => setShowAuthModal(true)} />
          ) : showEmptyState ? (
            <EmptyState
              error={error}
              inputMessage={inputMessage}
              isTyping={isTyping}
              onInputChange={setInputMessage}
              onSendMessage={handleSendMessage}
              onSuggestionClick={setInputMessage}
            />
          ) : (
            <ChatView
              messages={messages}
              thinkingSteps={thinkingSteps}
              streamingContent={streamingContent}
              isStreaming={isStreaming}
              isTyping={isTyping}
              messagesEndRef={messagesEndRef}
            />
          )}
        </div>

        {/* Input Area - only show when there are messages */}
        {isLoggedIn && messages.length > 0 && (
          <div className="border-t border-border bg-primary">
            {error && <div className="error-banner max-w-3xl mx-auto mt-4">{error}</div>}
            <MessageInput
              onSendMessage={handleSendMessage}
              disabled={isTyping}
              value={inputMessage}
              onChange={setInputMessage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsWrapper() {
  const navigate = useNavigate();
  const [token] = useState(() => localStorage.getItem('token'));
  const [username] = useState(() => localStorage.getItem('username') || '');
  const [config, setConfig] = useState<AgentConfig | null>(null);
  const [configForm, setConfigForm] = useState<ConfigFormData>(INITIAL_CONFIG_FORM);
  const [databaseConfig, setDatabaseConfig] = useState<DatabaseConfig | null>(null);
  const [customInstructions, setCustomInstructions] = useState<CustomInstructions | null>(null);

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    // Load config
    fetch(`${API_BASE_URL}/api/v1/config/me/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data) {
          setConfig(data);
          setConfigForm({
            telegram_bot_token: '',
            anthropic_api_key: '',
            is_active: data.is_active || false,
            auto_start: data.auto_start || false,
          });
        }
      })
      .catch(console.error);
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleSaveApiKeys = async () => {
    if (!token) return;

    const method = config ? 'PATCH' : 'POST';
    const url = config
      ? `${API_BASE_URL}/api/v1/config/${config.id}/`
      : `${API_BASE_URL}/api/v1/config/`;

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(configForm),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Configuration save failed');
    }

    const data = await response.json();
    setConfig(data);
    setConfigForm({
      ...configForm,
      telegram_bot_token: '',
      anthropic_api_key: '',
    });
  };

  const handleSaveDatabase = async (data: DatabaseConfig) => {
    console.log('Save database config:', data);
    setDatabaseConfig(data);
  };

  const handleSaveCustomInstructions = async (data: CustomInstructions) => {
    console.log('Save custom instructions:', data);
    setCustomInstructions(data);
  };

  return (
    <SettingsPage
      config={config}
      databaseConfig={databaseConfig}
      customInstructions={customInstructions}
      configForm={configForm}
      onConfigFormChange={(updates) => setConfigForm((prev) => ({ ...prev, ...updates }))}
      onSaveApiKeys={handleSaveApiKeys}
      onSaveDatabase={handleSaveDatabase}
      onSaveCustomInstructions={handleSaveCustomInstructions}
      onClose={() => navigate('/')}
      username={username}
      onLogout={handleLogout}
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatApp />} />
        <Route path="/c/:sessionId" element={<ChatApp />} />
        <Route path="/settings" element={<SettingsWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
