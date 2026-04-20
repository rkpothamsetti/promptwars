import React from 'react';

const StadiumMap = ({ data, activePersona }) => {
  // Simple SVG mapping of sections
  // We'll represent the stadium as an oval with 4 main stands
  const getSectionColor = (id) => {
    const section = data.find(s => s.id === id);
    if (!section) return 'rgba(255,255,255,0.05)';
    if (section.status === 'HIGH') return 'rgba(231, 76, 60, 0.6)';
    if (section.status === 'MEDIUM') return 'rgba(241, 196, 15, 0.4)';
    return 'rgba(46, 204, 113, 0.3)';
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '300px' }}>
      <svg viewBox="0 0 400 300" style={{ width: '100%', height: '100%' }}>
        {/* Outfield / Grass */}
        <ellipse cx="200" cy="150" rx="160" ry="120" fill="#1a4d2e" stroke="#2ecc71" strokeWidth="2" />
        
        {/* Pitch */}
        <rect x="190" y="120" width="20" height="60" fill="#c4a484" />
        
        {/* Stands (Interactive Sections) */}
        
        {/* North Pavilion (S1) */}
        <path d="M 100 50 Q 200 10 300 50 L 320 30 Q 200 -20 80 30 Z" fill={getSectionColor('S1')} stroke="white" strokeWidth="0.5" />
        <text x="200" y="35" fontSize="10" fill="white" textAnchor="middle" style={{ pointerEvents: 'none' }}>NORTH PAVILION</text>

        {/* South Hill (S4) */}
        <path d="M 100 250 Q 200 290 300 250 L 320 270 Q 200 320 80 270 Z" fill={getSectionColor('S4')} stroke="white" strokeWidth="0.5" />
        <text x="200" y="275" fontSize="10" fill="white" textAnchor="middle" style={{ pointerEvents: 'none' }}>SOUTH HILL</text>

        {/* East Stand (S2) */}
        <path d="M 330 80 Q 380 150 330 220 L 350 240 Q 410 150 350 60 Z" fill={getSectionColor('S2')} stroke="white" strokeWidth="0.5" />
        <text x="365" y="155" fontSize="10" fill="white" textAnchor="middle" transform="rotate(90, 365, 155)" style={{ pointerEvents: 'none' }}>EAST STAND</text>

        {/* West Stand (S3) */}
        <path d="M 70 80 Q 20 150 70 220 L 50 240 Q -10 150 50 60 Z" fill={getSectionColor('S3')} stroke="white" strokeWidth="0.5" />
        <text x="35" y="155" fontSize="10" fill="white" textAnchor="middle" transform="rotate(-90, 35, 155)" style={{ pointerEvents: 'none' }}>WEST STAND</text>

        {/* Heatmap Overlays (if STAFF) */}
        {activePersona.id === 'STAFF' && data.filter(s => s.status === 'HIGH').map(s => (
          <circle key={`heat-${s.id}`} cx={s.id === 'S1' ? 200 : s.id === 'S2' ? 350 : s.id === 'S3' ? 50 : 200} cy={s.id === 'S1' ? 30 : s.id === 'S2' ? 150 : s.id === 'S3' ? 150 : 270} r="25" fill="url(#heatGradient)" />
        ))}

        <defs>
          <radialGradient id="heatGradient">
            <stop offset="0%" stopColor="#e74c3c" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#e74c3c" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Legend Overlay */}
      <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', padding: '8px', borderRadius: '8px', fontSize: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '8px', height: '8px', background: 'rgba(46, 204, 113, 0.3)', border: '1px solid white' }}></div> Normal</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '8px', height: '8px', background: 'rgba(231, 76, 60, 0.6)', border: '1px solid white' }}></div> Congested</div>
      </div>
    </div>
  );
};

export default StadiumMap;
