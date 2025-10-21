import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chatbot.css';

// RECIBE sessionId DESDE Dashboard
const Chatbot = ({ userId, moodLevel, sessionId }) => {
  const [messages, setMessages] = useState([
    { text: "Hola, soy tu terapeuta virtual. ¿Cómo te sientes hoy?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await axios.post('http://localhost:4000/api/chat', {
        message: input,
        sessionId: sessionId, // CORRECTO: Usa el sessionId válido (ej: "user_4")
        moodLevel: moodLevel || 'neutral' // CORRECTO: Envía moodLevel con fallback
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const botMessage = { text: res.data.message, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error en chatbot:', error);
      const errorMsg = { 
        text: 'No puedo conectarme. Revisa tu conexión.', 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>Terapeuta Virtual</h3>
        <span className="status">En línea</span>
      </div>

      <div className="messages-container">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {msg.text}
          </div>
        ))}
        {isTyping && (
          <div className="message bot-message typing">
            <span className="dots">...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isTyping && sendMessage()}
          placeholder="Escribe tu mensaje..."
          disabled={isTyping}
        />
        <button onClick={sendMessage} disabled={isTyping}>
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Chatbot;