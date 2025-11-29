const API_BASE_URL = 'https://biagent.diyarbek.uz';

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
    console.log('🔵 Creating session...');
    console.log('Token:', token ? 'exists' : 'missing');
    console.log('Title:', title);

    const response = await fetch(`${this.baseUrl}/api/v1/sessions/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title })
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.detail || errorData.message || 'Session yaratib bo\'lmadi');
      } catch {
        throw new Error(`Server xatolik: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log('✅ Session created:', data);
    return data;
  } catch (error) {
    console.error('❌ Create session error:', error);
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

    // If onChunk callback provided, use streaming; otherwise use standard request
    if (onChunk && typeof onChunk === 'function') {
      return this.sendStreamingMessage(payload, token, onChunk);
    }

    // Fallback to standard non-streaming request
    return this.sendStandardRequest(payload, token);
  }

  async sendStreamingMessage(payload, token, onChunk) {
    // Try streaming endpoint first
    try {
      return await this.sendStreamingRequest(payload, token, onChunk);
    } catch (streamError) {
      console.warn('Streaming endpoint not available, falling back to standard:', streamError);
      // For fallback, accumulate final response
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
    let accumulatedContent = '';
    let lastStepNumber = 0;
    let completeEmitted = false;

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

          const dataLine = eventChunk
            .split('\n')
            .find(line => line.startsWith('data:'));

          if (dataLine) {
            const rawPayload = dataLine.replace('data:', '').trim();

            // Skip empty or done markers
            if (!rawPayload || rawPayload === '[DONE]') {
              continue;
            }

            try {
              const parsed = JSON.parse(rawPayload);

              // Store the full response (last chunk will have complete data)
              if (parsed) {
                fullResponse = parsed;

                this.emitStreamEvents(parsed, onChunk, {
                  accumulatedContentRef: () => accumulatedContent,
                  setAccumulatedContent: (val) => { accumulatedContent = val; },
                  lastStepNumberRef: () => lastStepNumber,
                  setLastStepNumber: (val) => { lastStepNumber = val; },
                  setCompleteEmitted: (val) => { completeEmitted = val; }
                });
              }
            } catch (err) {
              console.warn('Streaming chunk parse error:', rawPayload, err);
            }
          }
        }
      }

      // Final flush of remaining buffer
      if (buffer.trim()) {
        const dataLine = buffer.split('\n').find(line => line.startsWith('data:'));
        if (dataLine) {
          const rawPayload = dataLine.replace('data:', '').trim();
          if (rawPayload && rawPayload !== '[DONE]') {
            try {
              const parsed = JSON.parse(rawPayload);
              if (parsed) {
                fullResponse = parsed;
                this.emitStreamEvents(parsed, onChunk, {
                  accumulatedContentRef: () => accumulatedContent,
                  setAccumulatedContent: (val) => { accumulatedContent = val; },
                  lastStepNumberRef: () => lastStepNumber,
                  setLastStepNumber: (val) => { lastStepNumber = val; },
                  setCompleteEmitted: (val) => { completeEmitted = val; }
                });
              }
            } catch (err) {
              console.warn('Final chunk parse error:', err);
            }
          }
        }
      }

      if (!fullResponse) {
        throw new Error('Streaming response was empty');
      }

      if (!completeEmitted) {
        onChunk({
          type: 'complete',
          step: 'Analysis complete',
          stepNumber: lastStepNumber > 0 ? lastStepNumber : undefined
        });
      }

      return this.normalizeFiles(fullResponse);
    } finally {
      reader.cancel();
    }
  }

  emitStreamEvents(parsed, onChunk, helpers) {
    const {
      accumulatedContentRef,
      setAccumulatedContent,
      lastStepNumberRef,
      setLastStepNumber,
      setCompleteEmitted
    } = helpers;

    if (parsed.content) {
      const updated = accumulatedContentRef() + parsed.content;
      setAccumulatedContent(updated);
      onChunk({
        type: 'content',
        content: parsed.content,
        accumulated: updated
      });
    }

    const thinkingText = parsed.thinking || parsed.step || parsed.status_text;
    const thinkingType = parsed.type || parsed.event || parsed.status;

    if (thinkingText && (thinkingType === 'thinking' || thinkingType === 'step' || !thinkingType)) {
      const nextStepNumber = parsed.stepNumber || parsed.step_number || lastStepNumberRef() + 1;
      setLastStepNumber(nextStepNumber);
      onChunk({
        type: 'thinking',
        step: thinkingText,
        stepNumber: nextStepNumber
      });
    }

    if (parsed.type === 'complete' || parsed.status === 'complete' || parsed.complete) {
      setCompleteEmitted(true);
      onChunk({
        type: 'complete',
        step: parsed.complete || parsed.status_text || 'Analysis complete',
        stepNumber: parsed.stepNumber || parsed.step_number || lastStepNumberRef()
      });
    }

    if (parsed.files || parsed.file_paths) {
      onChunk({
        type: 'files',
        files: parsed.files || parsed.file_paths
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