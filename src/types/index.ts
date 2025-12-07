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
  files?: FileInfo[];
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

export interface AgentConfig {
  id: string;
  is_active: boolean;
  auto_start: boolean;
  has_telegram_token: boolean;
  has_telegram_chat_id: boolean;
  has_anthropic_key: boolean;
}

export interface ConfigFormData {
  telegram_bot_token: string;
  telegram_chat_id: string;
  anthropic_api_key: string;
  is_active: boolean;
  auto_start: boolean;
  bi_model: string;
  sql_model: string;
  recursion_limit: number;
  max_sql_retries: number;
  temperature: number;
}

// Database Connection (from /api/v1/connections/)
export type DatabaseDialect = 'postgresql' | 'mysql' | 'sqlite';

export interface DatabaseConnection {
  id: number;
  alias: string;
  dialect: DatabaseDialect;
  is_default: boolean;
  schema_filter?: string[];
  created_at: string;
  updated_at: string;
}

export interface DatabaseConnectionCreate {
  alias: string;
  connection_uri: string;
  dialect?: DatabaseDialect;
  is_default?: boolean;
  schema_filter?: string[];
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  tables_count?: number;
  tables?: string[];
}

// Instructions (from /api/v1/sqlagent/instructions/)
export interface Instruction {
  id: string;
  instruction: string;
  is_active: boolean;
  created_at: string;
  db_connection_id: string;
}

export interface InstructionCreate {
  instruction: string;
}

export interface InstructionUpdate {
  instruction: string;
  is_active?: boolean;
}

// Table Schemas (from /api/v1/sqlagent/tables/)
export interface ColumnDescription {
  name: string;
  type: string;
  comment: string | null;
  nullable: boolean;
}

export interface TableDescription {
  name: string;
  description: string | null;
  columns: ColumnDescription[];
}

export interface TableDescriptionUpdate {
  description?: string;
  columns?: Array<{ name: string; description: string }>;
}

export type SettingsSection =
  | 'general'
  | 'api-keys'
  | 'ai-config'
  | 'connections'
  | 'instructions'
  | 'tables'
  | 'account';

// ============================================
// File Types
// ============================================

export interface FileInfo {
  name: string;
  url: string;
  type: string;
  size: number;
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
  success: boolean;
  response: string;
  files?: FileInfo[];
  session_id?: string;
  session_title?: string;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
  };
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
  files: FileInfo[];
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
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export interface SettingsPageProps {
  // API Keys
  config: AgentConfig | null;
  configForm: ConfigFormData;
  onConfigFormChange: (updates: Partial<ConfigFormData>) => void;
  onSaveApiKeys: () => Promise<void>;
  isSavingApiKeys: boolean;

  // Connections
  connections: DatabaseConnection[];
  onCreateConnection: (data: DatabaseConnectionCreate) => Promise<void>;
  onUpdateConnection: (id: number, data: Partial<DatabaseConnectionCreate>) => Promise<void>;
  onDeleteConnection: (id: number) => Promise<void>;
  onSetDefaultConnection: (id: number) => Promise<void>;
  onTestConnection: (id: number) => Promise<ConnectionTestResult>;
  isSavingConnection: boolean;

  // Instructions
  instructions: Instruction[];
  onCreateInstruction: (data: InstructionCreate) => Promise<void>;
  onUpdateInstruction: (id: string, data: InstructionUpdate) => Promise<void>;
  onDeleteInstruction: (id: string) => Promise<void>;
  isSavingInstruction: boolean;

  // Tables
  tables: TableDescription[];
  onUpdateTable: (tableName: string, data: TableDescriptionUpdate) => Promise<void>;
  isSavingTable: boolean;
  isLoadingTables: boolean;
  onRefreshTables: () => Promise<void>;

  // Navigation & User
  onClose: () => void;
  username: string;
  onLogout: () => void;
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
  telegram_bot_token: '',
  telegram_chat_id: '',
  anthropic_api_key: '',
  is_active: false,
  auto_start: false,
  bi_model: 'claude-sonnet-4-20250514',
  sql_model: 'claude-haiku-3-5-20241022',
  recursion_limit: 15,
  max_sql_retries: 2,
  temperature: 0,
};
