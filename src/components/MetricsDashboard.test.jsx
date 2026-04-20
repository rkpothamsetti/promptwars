import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MetricsDashboard from './MetricsDashboard';
import { PERSONAS } from '../lib/constants';

const mockData = [
  { id: 'S1', name: 'North Pavilion', type: 'seating', density: 90, status: 'HIGH' },
  { id: 'C1', name: 'Main Concession', type: 'concession', waitTime: 12, status: 'MEDIUM' },
  { id: 'R1', name: 'Restrooms', type: 'restroom', waitTime: 2, status: 'LOW' }
];

describe('MetricsDashboard Component', () => {
  it('renders operational alerts for STAFF persona', () => {
    render(<MetricsDashboard stadiumData={mockData} activePersona={PERSONAS.STAFF} />);
    
    expect(screen.getByText(/Operational Alerts/i)).toBeDefined();
    expect(screen.getByText(/Security Alert:/i)).toBeDefined();
    expect(screen.getByText(/90%/i)).toBeDefined(); // North pavilion density
    expect(screen.queryByText(/Order Food & Drinks/i)).toBeNull(); // Should not show for staff
  });

  it('renders live utilities and wait times for FAN persona', () => {
    render(<MetricsDashboard stadiumData={mockData} activePersona={PERSONAS.FAN} />);
    
    expect(screen.getByText(/Live Utilities/i)).toBeDefined();
    expect(screen.getByText(/12m wait/i)).toBeDefined(); // Concession wait time
    expect(screen.getByText(/Order Food & Drinks/i)).toBeDefined();
    expect(screen.getByText(/Track Squad/i)).toBeDefined();
    expect(screen.queryByText(/Security Alert:/i)).toBeNull(); // Should not show for fans
  });
});
