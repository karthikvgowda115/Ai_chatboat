import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatAPI = {
  sendMessage: async (message, sessionId) => {
    try {
      const response = await api.post('/api/chat/message', {
        message,
        sessionId
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to send message');
    }
  },

  getHistory: async (sessionId) => {
    try {
      const response = await api.get(`/api/chat/history/${sessionId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get history');
    }
  },

  clearHistory: async (sessionId) => {
    try {
      const response = await api.delete(`/api/chat/clear/${sessionId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to clear history');
    }
  }
};

export default api;