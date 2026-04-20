import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './index.css';
import { getSimulationData } from './lib/simulation_engine';
import { getGeminiAdvice } from './lib/gemini_engine';
import { PERSONAS } from './lib/constants';

import Header from './components/Header';
import StadiumMap from './components/StadiumMap';
import AIConcierge from './components/AIConcierge';
import MetricsDashboard from './components/MetricsDashboard';

function App() {
  const [activePersona, setActivePersona] = useState(PERSONAS.FAN);
  const [stadiumData, setStadiumData] = useState(getSimulationData);
  const [aiAdvice, setAiAdvice] = useState(null);

  useEffect(() => {
    // Data polling (every 5 seconds)
    const interval = setInterval(() => {
      setStadiumData(getSimulationData());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Use useCallback to prevent unnecessary re-renders of child components
  const handlePersonaChange = useCallback((newPersona) => {
    setActivePersona(newPersona);
  }, []);

  // Memoize the status string to prevent constant AI requeries unless status fundamentally changes
  const stadiumStatusKey = useMemo(() => {
    return stadiumData.map(s => s.status).join(',');
  }, [stadiumData]);

  useEffect(() => {
    let isMounted = true;
    const updateAdvice = async () => {
      const advice = await getGeminiAdvice(activePersona, stadiumData);
      if (isMounted) setAiAdvice(advice);
    };
    if (stadiumData.length > 0) {
      updateAdvice();
    }
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePersona, stadiumStatusKey]); 

  return (
    <div className="container animate-fade" style={{ padding: '2rem 1rem' }} role="main">
      <Header activePersona={activePersona} setActivePersona={handlePersonaChange} />

      <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        
        {/* Module 1: The Smart Map */}
        <section className="glass-card" style={{ gridColumn: activePersona.id === 'STAFF' ? 'span 2' : 'auto' }} aria-label="Interactive Map">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>{activePersona.id === 'STAFF' ? 'Crowd Heatmap' : 'Intelligent Venue Map'}</h2>
            <span className="badge badge-green" aria-hidden="true">LIVE</span>
          </div>
          <div style={{ 
            height: '400px', 
            background: 'rgba(0,0,0,0.3)', 
            borderRadius: '16px', 
            overflow: 'hidden',
            border: '1px solid var(--border-light)',
            position: 'relative'
          }}>
            <StadiumMap data={stadiumData} activePersona={activePersona} />
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--secondary)' }}>PROACTIVE AI INSIGHT</h4>
            <p style={{ fontSize: '0.95rem' }} aria-live="polite">
              {aiAdvice ? aiAdvice.message : "Analyzing stadium conditions..."}
            </p>
          </div>
        </section>

        {/* Module 2: AI Concierge */}
        <AIConcierge aiAdvice={aiAdvice} activePersona={activePersona} />

        {/* Module 3: Active Coordination / Metrics */}
        <MetricsDashboard stadiumData={stadiumData} activePersona={activePersona} />

      </main>

      <footer style={{ marginTop: 'auto', padding: '4rem 0 2rem', textAlign: 'center', opacity: 0.5, fontSize: '0.8rem' }} role="contentinfo">
        SmartStadium OS • Built with Google Antigravity • Cricket World Cup Edition 2026
      </footer>
    </div>
  );
}

export default App;
