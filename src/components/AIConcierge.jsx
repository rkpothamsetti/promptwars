import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';

/**
 * AI Concierge component for the smart stadium, powered by Gemini.
 */
const AIConcierge = React.memo(({ aiAdvice, activePersona }) => {
  const [inputValue, setInputValue] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSend = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      // Advanced sanitization using DOMPurify for security
      const cleanInput = DOMPurify.sanitize(inputValue);
      setChatHistory([...chatHistory, { type: 'user', text: cleanInput }]);
      setInputValue('');
      
      // Simulate reply
      setTimeout(() => {
        setChatHistory(prev => [...prev, { type: 'ai', text: "I'm analyzing the venue data to assist you with that..." }]);
      }, 600);
    }
  };

  return (
    <section className="glass-card" aria-label="AI Concierge Section">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 id="ai-concierge-title">AI Concierge</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Powered by Gemini API</p>
      </div>
      <div 
        role="log" 
        aria-live="polite"
        style={{ height: '250px', overflowY: 'auto', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem' }}
      >
        <div className="badge badge-green" style={{ alignSelf: 'flex-start', maxWidth: '85%', padding: '0.75rem', borderRadius: '12px 12px 12px 0', lineHeight: '1.4' }}>
          {aiAdvice ? `I've analyzed the current state: ${aiAdvice.message}` : "Gathering real-time venue data..."}
        </div>
        
        {activePersona.id === 'FAN' && (
          <>
            <div className="badge badge-gold" style={{ alignSelf: 'flex-end', maxWidth: '80%', padding: '0.75rem', borderRadius: '12px 12px 0 12px', color: '#000' }}>
              Where's my squad sitting?
            </div>
            <div className="badge badge-green" style={{ alignSelf: 'flex-start', maxWidth: '85%', padding: '0.75rem', borderRadius: '12px 12px 12px 0', lineHeight: '1.4' }}>
              Your squad (Rahul & Priya) are currently in Section S1. Based on their movement, recommended meetup point is near the North Concession in 15 mins.
            </div>
          </>
        )}

        {chatHistory.map((msg, idx) => (
          <div 
            key={idx} 
            className={`badge ${msg.type === 'user' ? 'badge-gold' : 'badge-green'}`} 
            style={{ 
              alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start', 
              maxWidth: '85%', 
              padding: '0.75rem', 
              borderRadius: msg.type === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0', 
              lineHeight: '1.4',
              color: msg.type === 'user' ? '#000' : 'var(--primary)'
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <input 
        type="text" 
        aria-label="Ask the AI Concierge"
        placeholder="Ask anything... (Press Enter to send)" 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleSend}
        style={{ 
          width: '100%', 
          background: 'rgba(0,0,0,0.3)', 
          border: '1px solid var(--border-light)', 
          padding: '1rem', 
          borderRadius: '12px',
          color: 'white',
          outline: 'none'
        }} 
      />
    </section>
  );
});

AIConcierge.propTypes = {
  aiAdvice: PropTypes.shape({
    message: PropTypes.string,
    action: PropTypes.string
  }),
  activePersona: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    icon: PropTypes.string,
    description: PropTypes.string,
    theme: PropTypes.string
  }).isRequired
};

export default AIConcierge;
