import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Header from '../common/Header';
import { useChatActions } from '../../hooks/useChat';
import './ChatScreen.scss';

const ChatScreen = () => {
  const { messages, isLoading, clearChat, sessionId } = useChatActions();

  return (
    <div className="chat-screen">
      <Header 
        title="News Chatbot" 
        onReset={clearChat}
        sessionId={sessionId}
      />
      
      <MessageList messages={messages} isLoading={isLoading} />
      
      <MessageInput disabled={isLoading} />
    </div>
  );
};

export default ChatScreen;