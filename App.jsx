import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Layout/Header';
import ChatArea from './components/Chat/ChatArea';
import MessageInput from './components/Chat/MessageInput';
import LoginModal from './components/Auth/LoginModal';
import ThinkingIndicator from './components/Chat/ThinkingIndicator';
import ApiService from './services/api';
import './styles/markdown.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [token, setToken] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [error, setError] = useState('');
  const [streamingData, setStreamingData] = useState({ thinking: '', step: '' });

  // Load token from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');
    if (savedToken && savedUsername) {
      setToken(savedToken);
      setUsername(savedUsername);
      setIsLoggedIn(true);
      loadSessions(savedToken);
    }
  }, []);

  // Auth handlers
  const handleLogin = async (username, password) => {
    setError('');
    try {
      const data = await ApiService.login(username, password);
      setToken(data.access);
      setUsername(username);
      setIsLoggedIn(true);
      setShowAuthModal(false);
      
      localStorage.setItem('token', data.access);
      localStorage.setItem('refresh', data.refresh);
      localStorage.setItem('username', username);
      
      loadSessions(data.access);
    } catch (err) {
      setError(err.message);
    }
  };


  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken(null);
    setUsername('');
    setSessions([]);
    setCurrentSessionId(null);
    setMessages([]);
    localStorage.clear();
  };

  // Session handlers
  const loadSessions = async (authToken) => {
    try {
      const data = await ApiService.getSessions(authToken || token);
      setSessions(data);
      if (data.length > 0 && !currentSessionId) {
        selectSession(data[0].id, authToken);
      }
    } catch (err) {
      console.error('Load sessions error:', err);
    }
  };

  const createNewSession = async () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    try {
      const newSession = await ApiService.createSession(token);
      setSessions([newSession, ...sessions]);
      setCurrentSessionId(newSession.id);
      setMessages([]);
    } catch (err) {
      console.error('Create session error:', err);
      setError('Yangi chat ochishda xatolik');
    }
  };

  const selectSession = async (sessionId, authToken) => {
    setCurrentSessionId(sessionId);
    try {
      const data = await ApiService.getSession(sessionId, authToken || token);
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Select session error:', err);
      setMessages([]);
    }
  };

  const deleteSession = async (sessionId, e) => {
    e.stopPropagation();
    try {
      await ApiService.deleteSession(sessionId, token);
      const updatedSessions = sessions.filter(s => s.id !== sessionId);
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
      console.error('Delete session error:', err);
      setError('Chat o\'chirishda xatolik');
    }
  };

  // Message handler
// sendMessage funksiyasini yangilang
const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: messageText,
      created_at: new Date().toISOString()
    };

    setMessages([...messages, userMessage]);
    setIsTyping(true);
    setError('');
    setStreamingData({ thinking: '', step: '' });

    let accumulatedContent = '';
    let finalSessionId = currentSessionId;
    let finalFiles = [];

    try {
      await ApiService.sendMessageStream(
        messageText, 
        currentSessionId, 
        token,
        (chunk) => {
          console.log('Stream chunk:', chunk);

          // Update thinking/step indicators
          if (chunk.thinking) {
            setStreamingData(prev => ({ ...prev, thinking: chunk.thinking }));
          }
          if (chunk.step) {
            setStreamingData(prev => ({ ...prev, step: chunk.step }));
          }

          // Accumulate content
          if (chunk.content) {
            accumulatedContent += chunk.content;
            
            // Update message in real-time
            setMessages(prev => {
              const lastMsg = prev[prev.length - 1];
              if (lastMsg && lastMsg.role === 'assistant') {
                return [
                  ...prev.slice(0, -1),
                  { ...lastMsg, content: accumulatedContent }
                ];
              } else {
                return [
                  ...prev,
                  {
                    id: Date.now() + 1,
                    role: 'assistant',
                    content: accumulatedContent,
                    created_at: new Date().toISOString(),
                    file_paths: []
                  }
                ];
              }
            });
          }

          // Store session_id and files
          if (chunk.session_id) {
            finalSessionId = chunk.session_id;
          }
          if (chunk.files) {
            finalFiles = chunk.files;
          }
        }
      );

      // Update final message with files
      if (finalFiles.length > 0) {
        setMessages(prev => {
          const lastMsg = prev[prev.length - 1];
          return [
            ...prev.slice(0, -1),
            { ...lastMsg, file_paths: finalFiles }
          ];
        });
      }

      // Update session if changed
      if (finalSessionId && finalSessionId !== currentSessionId) {
        setCurrentSessionId(finalSessionId);
        loadSessions(token);
      }

    } catch (err) {
      console.error('Send message error:', err);
      setError('Xabar yuborishda xatolik');
    } finally {
      setIsTyping(false);
      setStreamingData({ thinking: '', step: '' });
    }
  };

  const currentSession = sessions.find(s => s.id === currentSessionId);

  return (
    <div style={styles.container}>
      {showAuthModal && (
        <LoginModal
          onLogin={handleLogin}
          onClose={() => setShowAuthModal(false)}
          onSwitchToRegister={() => setIsRegisterMode(true)}
          error={error}
        />
      )}

      <Sidebar
        isLoggedIn={isLoggedIn}
        username={username}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onNewChat={createNewSession}
        onSelectSession={selectSession}
        onDeleteSession={deleteSession}
        onLogin={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      <div style={styles.mainContent}>
        <Header currentSession={currentSession} isLoggedIn={isLoggedIn} />
        <ChatArea
          messages={messages}
          isTyping={isTyping}
          isLoggedIn={isLoggedIn}
          currentSession={currentSession}
          streamingData={streamingData}
        />
        {isLoggedIn && (
          <MessageInput onSendMessage={sendMessage} disabled={isTyping} />
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#0f1419',
    color: '#fff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0f1419'
  }
};

export default App;