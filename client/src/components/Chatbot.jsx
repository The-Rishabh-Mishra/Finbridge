import React, { useState, useRef, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import '../styles/chatbot.css';

const SUGGESTED_QUESTIONS = [
  'What is CIBIL score?',
  'How to improve credit score?',
  'What is EMI?',
  'What are loan types?',
  'How is interest calculated?',
  'What is savings account?',
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! 👋 I\'m your Banking Assistant. I can help you understand credit scores, loans, interest rates, and more. What would you like to know?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (text = inputValue) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setError('');
    setIsLoading(true);

    try {
      // Send to backend API
      const response = await axios.post('/chatbot/query', {
        message: text.trim(),
        conversationHistory: messages.map((m) => ({
          role: m.type === 'user' ? 'user' : 'assistant',
          content: m.text,
        })),
      });

      if (response.data.success) {
        // Add bot response
        const botMessage = {
          id: messages.length + 2,
          type: 'bot',
          text: response.data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        setError('Failed to get response. Please try again.');
      }
    } catch (err) {
      console.error('Chatbot error:', err);
      setError('Unable to connect to chatbot. Please try again later.');
      
      // Add error message to chat
      const errorMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: '❌ Sorry, I encountered an error. Please try again or ask another question.',
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question) => {
    handleSendMessage(question);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        text: 'Hello! 👋 I\'m your Banking Assistant. I can help you understand credit scores, loans, interest rates, and more. What would you like to know?',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className={`chatbot-floating-btn ${isOpen ? 'active' : ''}`}
        onClick={toggleChat}
        title={isOpen ? 'Close chat' : 'Open chat'}
        aria-label="Chat assistant"
      >
        {isOpen ? (
          <span className="chat-icon close">✕</span>
        ) : (
          <>
            <span className="chat-icon">💬</span>
            <span className="chat-badge">1</span>
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-content">
              <div className="chatbot-avatar">🤖</div>
              <div className="chatbot-title-section">
                <h3 className="chatbot-title">Banking Assistant</h3>
                <p className="chatbot-status">Always here to help</p>
              </div>
            </div>
            <button
              className="chatbot-close-btn"
              onClick={toggleChat}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages Container */}
          <div className="chatbot-messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-wrapper ${message.type}`}
              >
                <div
                  className={`message-bubble ${message.isError ? 'error' : ''}`}
                >
                  {message.text}
                </div>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="message-wrapper bot">
                <div className="message-bubble typing-bubble">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}

            {/* Scroll Anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions (shown when no messages or at start) */}
          {messages.length === 1 && !isLoading && (
            <div className="suggested-questions">
              <p className="suggested-label">Suggested questions:</p>
              <div className="suggested-buttons">
                {SUGGESTED_QUESTIONS.slice(0, 3).map((question, index) => (
                  <button
                    key={index}
                    className="suggested-btn"
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="chatbot-error-alert">
              <span>⚠️ {error}</span>
            </div>
          )}

          {/* Input Area */}
          <div className="chatbot-input-area">
            <div className="input-wrapper">
              <input
                ref={inputRef}
                type="text"
                className="chatbot-input"
                placeholder="Ask about banking, loans, credit scores..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isLoading) {
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
              />
              <button
                className="chatbot-send-btn"
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                aria-label="Send message"
              >
                {isLoading ? (
                  <span className="send-spinner">⏳</span>
                ) : (
                  <span className="send-icon">➤</span>
                )}
              </button>
            </div>

            {/* Footer Actions */}
            <div className="chatbot-footer-actions">
              <button
                className="action-btn clear-btn"
                onClick={clearChat}
                title="Clear conversation"
              >
                🔄 Clear
              </button>
              <p className="chatbot-footer-text">
                Banking knowledge at your fingertips
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

