import React from 'react';
import PropTypes from 'prop-types';
import { PERSONAS } from '../lib/constants';

/**
 * Application header and persona selector.
 */
const Header = React.memo(({ activePersona, setActivePersona }) => {
  return (
    <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>SmartStadium <span style={{ color: 'var(--primary)' }}>OS</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Advanced Venue Intelligence • Cricket Edition</p>
      </div>
      
      <div className="glass-card" style={{ padding: '0.75rem 1.5rem', borderRadius: '16px' }} role="region" aria-label="Persona Selector">
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
          ACTIVE SIMULATION: <span aria-live="polite">{activePersona.label}</span>
        </div>
        <div className="persona-switcher" role="tablist">
          {Object.values(PERSONAS).map(p => (
            <button 
              key={p.id}
              role="tab"
              aria-selected={activePersona.id === p.id}
              tabIndex={0}
              className={`persona-btn ${activePersona.id === p.id ? 'active' : ''}`}
              onClick={() => setActivePersona(p)}
              onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') setActivePersona(p) }}
            >
              <span aria-hidden="true">{p.icon}</span> {p.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
});

Header.propTypes = {
  activePersona: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    icon: PropTypes.string,
    description: PropTypes.string,
    theme: PropTypes.string
  }).isRequired,
  setActivePersona: PropTypes.func.isRequired
};

export default Header;
