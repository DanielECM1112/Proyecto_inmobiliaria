import React, { useState, useEffect, useRef } from 'react';
import './chatbot.css';
import ChatMessage from './ChatMessage';
import chatbotService from '../../services/chatbotService';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      text: '¡Bienvenido a LUXHABITAT! Soy tu asistente de lujo. ¿En qué puedo ayudarte a encontrar hoy?',
      type: 'bot'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [properties, setProperties] = useState([]);
  const [planes, setPlanes] = useState([]);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Cargar datos iniciales de la API
    const loadData = async () => {
      try {
        const propsData = await chatbotService.getProperties();
        const planesData = await chatbotService.getPlanes();
        setProperties(propsData);
        setPlanes(planesData);
      } catch (error) {
        console.error('Error loading chatbot data:', error);
      }
    };
    loadData();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, type: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatbotService.processMessage(input, properties, planes);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      setMessages(prev => [...prev, {
        text: 'Lo siento, he tenido un pequeño inconveniente técnico. ¿Podrías intentar de nuevo?',
        type: 'bot'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Botón Flotante */}
      <div className="chatbot-button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <span className="text-white text-2xl">✕</span>
        ) : (
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.477 2 2 6.477 2 12C2 13.591 2.373 15.095 3.037 16.425L2 22L7.575 20.963C8.905 21.627 10.409 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" fill="#d4af37"/>
            <path d="M16 14.5C16 15.328 15.328 16 14.5 16H9.5C8.672 16 8 15.328 8 14.5V11.5C8 10.672 8.672 10 9.5 10H14.5C15.328 10 16 10.672 16 11.5V14.5Z" fill="white"/>
          </svg>
        )}
      </div>

      {/* Ventana de Chat */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="header-info">
              <div className="bot-avatar">LH</div>
              <div className="header-text">
                <h3>LUXHABITAT AI</h3>
                <p>En línea • Asistente Premium</p>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
            {isTyping && (
              <div className="typing-indicator">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Pregúntame algo..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
            />
            <button type="submit" className="send-btn" disabled={isTyping || !input.trim()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
