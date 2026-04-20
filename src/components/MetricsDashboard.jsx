import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * Displays live utilities, metrics, and alerts based on the active persona.
 */
const MetricsDashboard = React.memo(({ stadiumData, activePersona }) => {
  const isStaff = activePersona.id === 'STAFF';
  
  // Efficiently calculate non-seating nodes for display
  const waitTimes = useMemo(() => {
    return stadiumData.filter(d => d.type !== 'seating').slice(0, 4);
  }, [stadiumData]);

  const criticalArea = useMemo(() => {
    return stadiumData.find(d => d.id === 'S1');
  }, [stadiumData]);

  return (
    <section className="glass-card" aria-label="Metrics and Utilities">
      <h2>{isStaff ? 'Operational Alerts' : 'Live Utilities'}</h2>
      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {!isStaff ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {waitTimes.map(d => (
              <div 
                key={d.id} 
                style={{ 
                  padding: '1rem', 
                  background: 'rgba(0,0,0,0.2)', 
                  borderRadius: '12px', 
                  borderLeft: `3px solid ${d.status === 'HIGH' ? '#e74c3c' : 'var(--primary)'}` 
                }}
              >
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{d.name}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }} aria-live="polite">
                  {d.waitTime}m wait
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div style={{ padding: '1rem', background: 'rgba(231, 76, 60, 0.1)', borderLeft: '4px solid #e74c3c', borderRadius: '4px' }}>
              <strong>Security Alert:</strong> North Pavilion at {criticalArea?.density || 0}% - Dispatching help.
            </div>
            <div style={{ padding: '1rem', background: 'rgba(212, 175, 55, 0.1)', borderLeft: '4px solid var(--secondary)', borderRadius: '4px' }}>
              <strong>Logistics:</strong> Gate B queue at 15m. Recommend redirecting to Gate A.
            </div>
          </>
        )}
        
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            {isStaff ? '📢 Broadcast Facility Update' : '🍵 Order Food & Drinks'}
          </button>
          {!isStaff && (
            <button className="btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
              👥 Track Squad
            </button>
          )}
        </div>
      </div>
    </section>
  );
});

MetricsDashboard.propTypes = {
  stadiumData: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    type: PropTypes.string,
    density: PropTypes.number,
    waitTime: PropTypes.number,
    status: PropTypes.string
  })).isRequired,
  activePersona: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
};

export default MetricsDashboard;
