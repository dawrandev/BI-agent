const API_BASE_URL = 'https://localagent.diyarbek.uz';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async login(username, password) {
    const response = await fetch(`${this.baseUrl}/api/v1/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      throw new Error('Login xato. Username yoki parol noto\'g\'ri.');
    }

    return response.json();
  }

  async register(username, password) {
    throw new Error('Register funksiyasi hozircha mavjud emas.');
  }

  async getSessions(token) {
    const response = await fetch(`${this.baseUrl}/api/v1/sessions/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Sessiyalarni yuklashda xatolik');
    }

    return response.json();
  }

  async getSession(sessionId, token) {
    const response = await fetch(`${this.baseUrl}/api/v1/sessions/${sessionId}/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Session yuklashda xatolik');
    }

    return response.json();
  }

  async createSession(token, title = 'New Chat') {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/sessions/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title })
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.detail || errorData.message || 'Session yaratib bo\'lmadi');
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

  async deleteSession(sessionId, token) {
    const response = await fetch(`${this.baseUrl}/api/v1/sessions/${sessionId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Session o\'chirishda xatolik');
    }

    return true;
  }

  async sendMessage(message, sessionId, token, onChunk) {
    const payload = {
      message,
      session_id: sessionId
    };

    if (onChunk && typeof onChunk === 'function') {
      return this.sendStreamingMessage(payload, token, onChunk);
    }

    return this.sendStandardRequest(payload, token);
  }

  async sendStreamingMessage(payload, token, onChunk) {
    try {
      return await this.sendStreamingRequest(payload, token, onChunk);
    } catch (streamError) {
      console.warn('Streaming endpoint not available, falling back to standard:', streamError);
      return this.sendStandardRequest(payload, token);
    }
  }

  async sendStreamingRequest(payload, token, onChunk) {
    const response = await fetch(`${this.baseUrl}/api/v1/sessions/stream/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify(payload)
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
    let fullResponse = null;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE events (separated by \n\n)
        let boundaryIndex;
        while ((boundaryIndex = buffer.indexOf('\n\n')) !== -1) {
          const eventChunk = buffer.slice(0, boundaryIndex);
          buffer = buffer.slice(boundaryIndex + 2);

          // Parse event type and data
          const lines = eventChunk.split('\n');
          let eventType = null;
          let eventData = null;

          for (const line of lines) {
            if (line.startsWith('event:')) {
              eventType = line.replace('event:', '').trim();
            } else if (line.startsWith('data:')) {
              const rawData = line.replace('data:', '').trim();
              if (rawData && rawData !== '[DONE]') {
                try {
                  eventData = JSON.parse(rawData);
                } catch (e) {
                  console.warn('Failed to parse SSE data:', rawData);
                }
              }
            }
          }

          if (eventType && eventData) {
            this.emitEvent(eventType, eventData, onChunk);

            // Store complete response
            if (eventType === 'complete') {
              fullResponse = eventData;
            }
          }
        }
      }

      // Flush remaining buffer
      if (buffer.trim()) {
        const lines = buffer.split('\n');
        let eventType = null;
        let eventData = null;

        for (const line of lines) {
          if (line.startsWith('event:')) {
            eventType = line.replace('event:', '').trim();
          } else if (line.startsWith('data:')) {
            const rawData = line.replace('data:', '').trim();
            if (rawData && rawData !== '[DONE]') {
              try {
                eventData = JSON.parse(rawData);
              } catch (e) {
                console.warn('Failed to parse SSE data:', rawData);
              }
            }
          }
        }

        if (eventType && eventData) {
          this.emitEvent(eventType, eventData, onChunk);
          if (eventType === 'complete') {
            fullResponse = eventData;
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

  emitEvent(eventType, data, onChunk) {
    // Map new event format to chunk types
    switch (eventType) {
      case 'step_started':
        onChunk({
          type: 'step_started',
          step: data.step,
          message: data.message
        });
        break;

      case 'step_completed':
        onChunk({
          type: 'step_completed',
          step: data.step,
          message: data.message
        });
        break;

      case 'react_thinking':
        onChunk({
          type: 'react_thinking',
          step: data.step,
          message: data.message,
          icon: data.icon || '🤔'
        });
        break;

      case 'react_action':
        onChunk({
          type: 'react_action',
          step: data.step,
          message: data.message,
          icon: data.icon || '🔧',
          tool: data.tool
        });
        break;

      case 'react_observation':
        onChunk({
          type: 'react_observation',
          step: data.step,
          message: data.message,
          icon: data.icon || '✅'
        });
        break;

      case 'react_finishing':
        onChunk({
          type: 'react_finishing',
          step: data.step,
          message: data.message,
          icon: data.icon || '📝'
        });
        break;

      case 'complete':
        onChunk({
          type: 'complete',
          response: data.response,
          files: data.files || [],
          session_id: data.session_id,
          session_title: data.session_title,
          usage: data.usage
        });
        break;

      default:
        // Handle any other event types
        onChunk({
          type: eventType,
          ...data
        });
    }
  }

  async sendStandardRequest(payload, token) {
    const response = await fetch(`${this.baseUrl}/api/v1/sessions/send_message/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Xabar yuborishda xatolik');
    }

    const data = await response.json();
    return this.normalizeFiles(data);
  }

  normalizeFiles(data) {
    const files = data.files || data.file_paths || [];
    return {
      ...data,
      files,
      file_paths: data.file_paths || files
    };
  }
}

export default new ApiService();
