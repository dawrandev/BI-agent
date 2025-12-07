import React from 'react';

// ============================================
// Core Types
// ============================================

export type MessageRole = 'user' | 'assistant';

export type StreamEventType =
  | 'step_started'
  | 'step_completed'
  | 'react_thinking'
  | 'react_action'
  | 'react_observation'
  | 'react_finishing'
  | 'complete';

// ============================================
// Data Models
// ============================================

export interface StreamChunk {
  type: StreamEventType;
  step?: string;
  message?: string;
  icon?: string;
  tool?: string;
  response?: string;
  session_id?: string;
  session_title?: string;
  files?: string[];
  usage?: Record<string, unknown>;
  completed?: boolean;
}

export interface Message {
  id: string | number;
  role: MessageRole;
  content: string;
  created_at: string;
  files?: string[];
  file_paths?: string[];
  thinkingSteps?: StreamChunk[];
  thinking_steps?: StreamChunk[];
}

export interface Session {
  id: string;
  title: string;
  messages?: Message[];
  created_at?: string;
  updated_at?: string;
}

// ============================================
// Auth Types
// ============================================

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

// ============================================
// Config Types
// ============================================

export interface OdooConfig {
  id: string;
  odoo_url: string;
  odoo_db: string;
  odoo_username: string;
  odoo_password?: string;
  telegram_bot_token?: string;
  openai_api_key?: string;
  is_active: boolean;
  auto_start: boolean;
}

export interface ConfigFormData {
  odoo_url: string;
  odoo_db: string;
  odoo_username: string;
  odoo_password: string;
  telegram_bot_token: string;
  openai_api_key: string;
  is_active: boolean;
  auto_start: boolean;
}

// ============================================
// API Types
// ============================================

export interface ApiError {
  detail?: string;
  message?: string;
}

export interface SendMessagePayload {
  message: string;
  session_id: string;
}

export interface SendMessageResponse {
  response: string;
  files?: string[];
  file_paths?: string[];
  session_id?: string;
  session_title?: string;
}

export type ChunkCallback = (chunk: StreamChunk) => void;

// ============================================
// Component Props
// ============================================

export interface SidebarProps {
  isLoggedIn: boolean;
  username: string;
  sessions: Session[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onLogin: () => void;
  onLogout: () => void;
  onSettings: () => void;
  isOpen: boolean;
}

export interface ChatMessageProps {
  message: Message;
}

export interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
}

export interface ThinkingIndicatorProps {
  steps: StreamChunk[];
  isStreaming: boolean;
}

export interface FileAttachmentProps {
  files: string[];
}

export interface CopyButtonProps {
  text: string;
}

export interface ChatHistoryProps {
  sessions: Session[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
}

export interface UserSectionProps {
  isLoggedIn: boolean;
  username: string;
  onLogin: () => void;
  onLogout: () => void;
  onSettings: () => void;
}

// ============================================
// New Component Props (Extracted from App.js)
// ============================================

export interface AuthModalProps {
  isOpen: boolean;
  isRegisterMode: boolean;
  error: string;
  username: string;
  password: string;
  email: string;
  passwordConfirm: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordConfirmChange: (value: string) => void;
  onLogin: (e: React.FormEvent) => void;
  onRegister: (e: React.FormEvent) => void;
  onToggleMode: () => void;
}

export interface ConfigModalProps {
  isOpen: boolean;
  error: string;
  configForm: ConfigFormData;
  onConfigFormChange: (updates: Partial<ConfigFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export interface EmptyStateProps {
  error: string;
  inputMessage: string;
  isTyping: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: (message: string) => void;
  onSuggestionClick: (prompt: string) => void;
}

export interface ChatViewProps {
  messages: Message[];
  thinkingSteps: StreamChunk[];
  streamingContent: string;
  isStreaming: boolean;
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export interface AppHeaderProps {
  title: string;
  isLoggedIn: boolean;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

// ============================================
// Suggestion Cards
// ============================================

export interface SuggestionCard {
  icon: string;
  title: string;
  subtitle: string;
  prompt: string;
}

export const SUGGESTION_CARDS: SuggestionCard[] = [
  {
    icon: '📈',
    title: 'Business Overview',
    subtitle: 'Revenue, orders, trends',
    prompt: 'Give me a business overview with revenue, orders, and trends',
  },
  {
    icon: '👥',
    title: 'Top Customers',
    subtitle: 'Customer rankings',
    prompt: 'Show me top customers by revenue',
  },
  {
    icon: '📦',
    title: 'Inventory Check',
    subtitle: 'Stock levels & alerts',
    prompt: 'Check inventory levels and show low stock alerts',
  },
  {
    icon: '📄',
    title: 'PDF Report',
    subtitle: 'Executive summary',
    prompt: 'Generate a PDF executive summary report',
  },
];

// ============================================
// Constants
// ============================================

export const API_BASE_URL = 'https://localagent.diyarbek.uz';

export const INITIAL_CONFIG_FORM: ConfigFormData = {
  odoo_url: '',
  odoo_db: '',
  odoo_username: '',
  odoo_password: '',
  telegram_bot_token: '',
  openai_api_key: '',
  is_active: true,
  auto_start: false,
};
