import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from './Header';
import { PERSONAS } from '../lib/constants';

describe('Header Component', () => {
  it('renders the header title correctly', () => {
    render(<Header activePersona={PERSONAS.FAN} setActivePersona={vi.fn()} />);
    expect(screen.getByText(/SmartStadium/i)).toBeDefined();
    expect(screen.getByText(/OS/i)).toBeDefined();
  });

  it('displays the active persona label', () => {
    render(<Header activePersona={PERSONAS.STAFF} setActivePersona={vi.fn()} />);
    expect(screen.getAllByText(PERSONAS.STAFF.label).length).toBeGreaterThan(0);
  });

  it('calls setActivePersona when a persona button is clicked', () => {
    const setActivePersonaMock = vi.fn();
    render(<Header activePersona={PERSONAS.FAN} setActivePersona={setActivePersonaMock} />);
    
    // Find the FAMILY button and click it
    const familyButton = screen.getByRole('tab', { name: new RegExp(PERSONAS.FAMILY.label, 'i') });
    fireEvent.click(familyButton);
    
    expect(setActivePersonaMock).toHaveBeenCalledWith(PERSONAS.FAMILY);
    expect(setActivePersonaMock).toHaveBeenCalledTimes(1);
  });

  it('sets aria-selected correctly', () => {
    render(<Header activePersona={PERSONAS.FAN} setActivePersona={vi.fn()} />);
    
    const fanButton = screen.getByRole('tab', { name: new RegExp(PERSONAS.FAN.label, 'i') });
    const familyButton = screen.getByRole('tab', { name: new RegExp(PERSONAS.FAMILY.label, 'i') });
    
    expect(fanButton.getAttribute('aria-selected')).toBe('true');
    expect(familyButton.getAttribute('aria-selected')).toBe('false');
  });
});
