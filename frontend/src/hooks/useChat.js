import { useCallback } from 'react';
import { useChat } from '../contexts/ChatContext';
import { chatAPI } from '../services/api';

export function useChatActions() {
  const { state, dispatch } = useChat();

  const sendMessage = useCallback(async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await chatAPI.sendMessage(messageText, state.sessionId);
      
      const assistantMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString()
      };

      dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });
      
      if (!state.sessionId) {
        dispatch({ type: 'SET_SESSION', payload: response.sessionId });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      dispatch({ type: 'ADD_MESSAGE', payload: errorMessage });
    }
  }, [state.sessionId, dispatch]);

  const clearChat = useCallback(async () => {
    if (state.sessionId) {
      try {
        await chatAPI.clearHistory(state.sessionId);
      } catch (error) {
        console.error('Failed to clear history on server:', error);
      }
    }
    
    dispatch({ type: 'CLEAR_MESSAGES' });
  }, [state.sessionId, dispatch]);

  const loadHistory = useCallback(async (sessionId) => {
    try {
      const response = await chatAPI.getHistory(sessionId);
      dispatch({ type: 'LOAD_HISTORY', payload: response.history });
      dispatch({ type: 'SET_SESSION', payload: sessionId });
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  }, [dispatch]);

  return {
    sendMessage,
    clearChat,
    loadHistory,
    messages: state.messages,
    sessionId: state.sessionId,
    isLoading: state.isLoading,
    error: state.error
  };
}