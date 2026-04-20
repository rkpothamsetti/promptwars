import { useState, useEffect } from 'react'
import './index.css'
import { getSimulationData, getSquadLocations } from './lib/simulation_engine'
import { getGeminiAdvice } from './lib/gemini_engine'
import StadiumMap from './components/StadiumMap'

const PERSONAS = {
  FAN: {
    id: 'FAN',
    label: 'Die-Hard Fan',
    icon: '🏏',
    description: 'Real-time stats, pre-ordering, and squad sync.',
    theme: 'green'
  },
  FAMILY: {
    id: 'FAMILY',
    label: 'Family Group',
    icon: '👨‍👩‍👧‍👦',
    description: 'Low-congestion routes and facility finders.',
    theme: 'gold'
  },
  STAFF: {
    id: 'STAFF',
    label: 'Ground Staff',
    icon: '🏢',
    description: 'Crowd heatmaps and logistical alerts.',
    theme: 'dark'
  }
}

function App() {
  const [activePersona, setActivePersona] = useState(PERSONAS.FAN)
  const [loading, setLoading] = useState(true)
  const [stadiumData, setStadiumData] = useState([])
  const [squad, setSquad] = useState([])
  const [aiAdvice, setAiAdvice] = useState(null)

  useEffect(() => {
    // Initial load
    const initialData = getSimulationData()
    setStadiumData(initialData)
    setSquad(getSquadLocations())
    setLoading(false)

    // Data polling (every 5 seconds)
    const interval = setInterval(() => {
      setStadiumData(getSimulationData())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Get new AI advice when persona or data changes significantly
    const updateAdvice = async () => {
      const advice = await getGeminiAdvice(activePersona, stadiumData)
      setAiAdvice(advice)
    }
    updateAdvice()
  }, [activePersona, stadiumData.map(s => s.status).join(',')]) 

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <div className="badge badge-green animate-fade">Initializing SmartStadium OS...</div>
      </div>
    )
  }

  return (
    <div className="container animate-fade" style={{ padding: '2rem 1rem' }}>
      {/* Header */}
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>SmartStadium <span style={{ color: 'var(--primary)' }}>OS</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Advanced Venue Intelligence • Cricket Edition</p>
        </div>
        
        <div className="glass-card" style={{ padding: '0.75rem 1.5rem', borderRadius: '16px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>ACTIVE SIMULATION: {activePersona.label}</div>
          <div className="persona-switcher">
            {Object.values(PERSONAS).map(p => (
              <button 
                key={p.id}
                className={`persona-btn ${activePersona.id === p.id ? 'active' : ''}`}
                onClick={() => setActivePersona(p)}
              >
                {p.icon} {p.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        
        {/* Module 1: The Smart Map */}
        <section className="glass-card" style={{ gridColumn: activePersona.id === 'STAFF' ? 'span 2' : 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>{activePersona.id === 'STAFF' ? 'Crowd Heatmap' : 'Intelligent Venue Map'}</h2>
            <span className="badge badge-green">LIVE</span>
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
            <p style={{ fontSize: '0.95rem' }}>
              {aiAdvice ? aiAdvice.message : "Analyzing stadium conditions..."}
            </p>
          </div>
        </section>

        {/* Module 2: AI Concierge */}
        <section className="glass-card">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2>AI Concierge</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Powered by Gemini</p>
          </div>
          <div style={{ height: '250px', overflowY: 'auto', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem' }}>
            <div className="badge badge-green" style={{ alignSelf: 'flex-start', maxWidth: '85%', padding: '0.75rem', borderRadius: '12px 12px 12px 0', lineHeight: '1.4' }}>
              {aiAdvice ? `I've analyzed the current state: ${aiAdvice.message}` : "Gathering real-time venue data..."}
            </div>
            {activePersona.id === 'FAN' && (
              <div className="badge badge-gold" style={{ alignSelf: 'flex-end', maxWidth: '80%', padding: '0.75rem', borderRadius: '12px 12px 0 12px', color: '#000' }}>
                Where's my squad sitting?
              </div>
            )}
            {activePersona.id === 'FAN' && (
              <div className="badge badge-green" style={{ alignSelf: 'flex-start', maxWidth: '85%', padding: '0.75rem', borderRadius: '12px 12px 12px 0', lineHeight: '1.4' }}>
                Your squad (Rahul & Priya) are currently in Section S1. Based on their movement, recommended meetup point is near the North Concession in 15 mins.
              </div>
            )}
          </div>
          <input 
            type="text" 
            placeholder="Ask anything..." 
            style={{ 
              width: '100%', 
              background: 'rgba(0,0,0,0.3)', 
              border: '1px solid var(--border-light)', 
              padding: '1rem', 
              borderRadius: '12px',
              color: 'white'
            }} 
          />
        </section>

        {/* Module 3: Active Coordination / Metrics */}
        <section className="glass-card">
          <h2>{activePersona.id === 'STAFF' ? 'Operational Alerts' : 'Live Utilities'}</h2>
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activePersona.id !== 'STAFF' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {stadiumData.filter(d => d.type !== 'seating').slice(0, 4).map(d => (
                  <div key={d.id} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', borderLeft: `3px solid ${d.status === 'HIGH' ? '#e74c3c' : 'var(--primary)'}` }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{d.name}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{d.waitTime}m wait</div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div style={{ padding: '1rem', background: 'rgba(231, 76, 60, 0.1)', borderLeft: '4px solid #e74c3c', borderRadius: '4px' }}>
                  <strong>Security Alert:</strong> North Pavilion at {stadiumData.find(d => d.id === 'S1')?.density}% - Dispatching help.
                </div>
                <div style={{ padding: '1rem', background: 'rgba(212, 175, 55, 0.1)', borderLeft: '4px solid var(--secondary)', borderRadius: '4px' }}>
                  <strong>Logistics:</strong> Gate B queue at 15m. Recommend redirecting to Gate A.
                </div>
              </>
            )}
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                 {activePersona.id === 'STAFF' ? '📢 Broadcast Facility Update' : '🍵 Order Food & Drinks'}
               </button>
               {activePersona.id !== 'STAFF' && <button className="btn-gold" style={{ width: '100%', justifyContent: 'center' }}>👥 Track Squad</button>}
            </div>
          </div>
        </section>

      </main>

      <footer style={{ marginTop: 'auto', padding: '4rem 0 2rem', textAlign: 'center', opacity: 0.5, fontSize: '0.8rem' }}>
        SmartStadium OS • Built with Google Antigravity • Cricket World Cup Edition 2026
      </footer>
    </div>
  )
}

export default App
