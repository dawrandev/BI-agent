import {
  AuthResponse,
  Session,
  SendMessagePayload,
  SendMessageResponse,
  StreamChunk,
  ChunkCallback,
  API_BASE_URL,
} from '../types';

// Custom error for auth failures
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

class ApiService {
  private baseUrl: string;
  private onAuthFailure: (() => void) | null = null;
  private isRefreshing = false;
  private refreshPromise: Promise<string | null> | null = null;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Set callback for when auth fails completely (refresh failed)
  setOnAuthFailure(callback: () => void) {
    this.onAuthFailure = callback;
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/api/v1/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error("Login xato. Username yoki parol noto'g'ri.");
    }

    return response.json();
  }

  // Refresh the access token using refresh token
  private async refreshToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem('refresh');
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      const newAccessToken = data.access;

      // Update localStorage
      localStorage.setItem('token', newAccessToken);

      return newAccessToken;
    } catch {
      return null;
    }
  }

  // Wrapper for fetch that handles token refresh
  private async fetchWithAuth(
    url: string,
    options: RequestInit = {},
    retryOnUnauth = true
  ): Promise<Response> {
    const token = localStorage.getItem('token');

    const headers = new Headers(options.headers);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(url, { ...options, headers });

    // If 401 and we should retry
    if (response.status === 401 && retryOnUnauth) {
      // If already refreshing, wait for that to complete
      if (this.isRefreshing && this.refreshPromise) {
        const newToken = await this.refreshPromise;
        if (newToken) {
          headers.set('Authorization', `Bearer ${newToken}`);
          return fetch(url, { ...options, headers });
        }
      } else {
        // Start refresh process
        this.isRefreshing = true;
        this.refreshPromise = this.refreshToken();

        try {
          const newToken = await this.refreshPromise;

          if (newToken) {
            headers.set('Authorization', `Bearer ${newToken}`);
            return fetch(url, { ...options, headers });
          } else {
            // Refresh failed, trigger logout
            this.triggerAuthFailure();
            throw new AuthError('Session expired. Please login again.');
          }
        } finally {
          this.isRefreshing = false;
          this.refreshPromise = null;
        }
      }
    }

    return response;
  }

  private triggerAuthFailure() {
    if (this.onAuthFailure) {
      this.onAuthFailure();
    }
  }

  async getSessions(): Promise<Session[]> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/api/v1/sessions/`);

    if (!response.ok) {
      throw new Error('Sessiyalarni yuklashda xatolik');
    }

    return response.json();
  }

  async getSession(sessionId: string): Promise<Session> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/api/v1/sessions/${sessionId}/`);

    if (!response.ok) {
      throw new Error('Session yuklashda xatolik');
    }

    return response.json();
  }

  async createSession(title: string = 'New Chat'): Promise<Session> {
    try {
      const response = await this.fetchWithAuth(`${this.baseUrl}/api/v1/sessions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.detail || errorData.message || "Session yaratib bo'lmadi");
        } catch {
          throw new Error(`Server xatolik: ${response.status}`);
        }
      }

      return await response.json();
    } catch (error) {
      console.error('Create session error:', error);
      throw error;
    }
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/api/v1/sessions/${sessionId}/`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error("Session o'chirishda xatolik");
    }

    return true;
  }

  async sendMessage(
    message: string,
    sessionId: string,
    onChunk?: ChunkCallback
  ): Promise<SendMessageResponse> {
    const payload: SendMessagePayload = {
      message,
      session_id: sessionId,
    };

    if (onChunk && typeof onChunk === 'function') {
      return this.sendStreamingMessage(payload, onChunk);
    }

    return this.sendStandardRequest(payload);
  }

  private async sendStreamingMessage(
    payload: SendMessagePayload,
    onChunk: ChunkCallback
  ): Promise<SendMessageResponse> {
    try {
      return await this.sendStreamingRequest(payload, onChunk);
    } catch (streamError) {
      console.warn('Streaming endpoint not available, falling back to standard:', streamError);
      return this.sendStandardRequest(payload);
    }
  }

  private async sendStreamingRequest(
    payload: SendMessagePayload,
    onChunk: ChunkCallback
  ): Promise<SendMessageResponse> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/api/v1/sessions/stream/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 404) {
      throw new Error('Streaming endpoint not available');
    }

    if (!response.ok) {
      throw new Error('Xabar yuborishda xatolik');
    }

    if (!response.body) {
      throw new Error('Streaming javobi mavjud emas');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let fullResponse: SendMessageResponse | null = null;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let boundaryIndex: number;
        while ((boundaryIndex = buffer.indexOf('\n\n')) !== -1) {
          const eventChunk = buffer.slice(0, boundaryIndex);
          buffer = buffer.slice(boundaryIndex + 2);

          const lines = eventChunk.split('\n');
          let eventType: string | null = null;
          let eventData: Record<string, unknown> | null = null;

          for (const line of lines) {
            if (line.startsWith('event:')) {
              eventType = line.replace('event:', '').trim();
            } else if (line.startsWith('data:')) {
              const rawData = line.replace('data:', '').trim();
              if (rawData && rawData !== '[DONE]') {
                try {
                  eventData = JSON.parse(rawData);
                } catch {
                  console.warn('Failed to parse SSE data:', rawData);
                }
              }
            }
          }

          if (eventType && eventData) {
            this.emitEvent(eventType, eventData, onChunk);

            if (eventType === 'complete') {
              fullResponse = eventData as unknown as SendMessageResponse;
            }
          }
        }
      }

      // Flush remaining buffer
      if (buffer.trim()) {
        const lines = buffer.split('\n');
        let eventType: string | null = null;
        let eventData: Record<string, unknown> | null = null;

        for (const line of lines) {
          if (line.startsWith('event:')) {
            eventType = line.replace('event:', '').trim();
          } else if (line.startsWith('data:')) {
            const rawData = line.replace('data:', '').trim();
            if (rawData && rawData !== '[DONE]') {
              try {
                eventData = JSON.parse(rawData);
              } catch {
                console.warn('Failed to parse SSE data:', rawData);
              }
            }
          }
        }

        if (eventType && eventData) {
          this.emitEvent(eventType, eventData, onChunk);
          if (eventType === 'complete') {
            fullResponse = eventData as unknown as SendMessageResponse;
          }
        }
      }

      if (!fullResponse) {
        throw new Error('Streaming response was empty');
      }

      return this.normalizeFiles(fullResponse);
    } finally {
      reader.cancel();
    }
  }

  private emitEvent(
    eventType: string,
    data: Record<string, unknown>,
    onChunk: ChunkCallback
  ): void {
    switch (eventType) {
      case 'step_started':
        onChunk({
          type: 'step_started',
          step: data.step as string,
          message: data.message as string,
        });
        break;

      case 'step_completed':
        onChunk({
          type: 'step_completed',
          step: data.step as string,
          message: data.message as string,
        });
        break;

      case 'react_thinking':
        onChunk({
          type: 'react_thinking',
          step: data.step as string,
          message: data.message as string,
          icon: (data.icon as string) || '🤔',
        });
        break;

      case 'react_action':
        onChunk({
          type: 'react_action',
          step: data.step as string,
          message: data.message as string,
          icon: (data.icon as string) || '🔧',
          tool: data.tool as string,
        });
        break;

      case 'react_observation':
        onChunk({
          type: 'react_observation',
          step: data.step as string,
          message: data.message as string,
          icon: (data.icon as string) || '✅',
        });
        break;

      case 'react_finishing':
        onChunk({
          type: 'react_finishing',
          step: data.step as string,
          message: data.message as string,
          icon: (data.icon as string) || '📝',
        });
        break;

      case 'complete':
        onChunk({
          type: 'complete',
          response: data.response as string,
          files: (data.files as string[]) || [],
          session_id: data.session_id as string,
          session_title: data.session_title as string,
          usage: data.usage as Record<string, unknown>,
        });
        break;

      default:
        onChunk({
          type: eventType as StreamChunk['type'],
          ...data,
        } as StreamChunk);
    }
  }

  private async sendStandardRequest(
    payload: SendMessagePayload
  ): Promise<SendMessageResponse> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/api/v1/sessions/send_message/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Xabar yuborishda xatolik');
    }

    const data = await response.json();
    return this.normalizeFiles(data);
  }

  private normalizeFiles(data: SendMessageResponse): SendMessageResponse {
    return {
      ...data,
      files: data.files || [],
    };
  }
}

const apiService = new ApiService();
export default apiService;
