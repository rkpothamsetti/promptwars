import { expect, test, describe } from 'vitest';
import { getSimulationData, getSquadLocations } from './simulation_engine';

describe('Simulation Engine', () => {
  test('getSimulationData returns correct structure and types', () => {
    const data = getSimulationData();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    
    const firstSection = data[0];
    expect(firstSection).toHaveProperty('id');
    expect(firstSection).toHaveProperty('name');
    expect(firstSection).toHaveProperty('type');
    expect(firstSection).toHaveProperty('density');
    expect(typeof firstSection.density).toBe('number');
    expect(firstSection.density).toBeGreaterThanOrEqual(0);
    expect(firstSection.density).toBeLessThanOrEqual(100);
    expect(firstSection).toHaveProperty('waitTime');
    expect(typeof firstSection.waitTime).toBe('number');
    expect(firstSection).toHaveProperty('status');
  });

  test('getSquadLocations returns at least 3 members with valid coordinates', () => {
    const squad = getSquadLocations();
    expect(squad.length).toBeGreaterThanOrEqual(3);
    
    squad.forEach(member => {
      expect(member).toHaveProperty('id');
      expect(member).toHaveProperty('name');
      expect(typeof member.lat).toBe('number');
      expect(typeof member.lng).toBe('number');
    });
  });

  // Edge cases and integration checks
  test('all sections are present and unique', () => {
    const data = getSimulationData();
    const ids = data.map(s => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
    expect(ids).toContain('S1');
    expect(ids).toContain('C1');
    expect(ids).toContain('R1');
  });

  test('wait times are correctly calculated based on type', () => {
    const data = getSimulationData();
    const concessions = data.filter(d => d.type === 'concession');
    const restrooms = data.filter(d => d.type === 'restroom');
    const gates = data.filter(d => d.type === 'gate');

    concessions.forEach(c => {
      // Density / 5
      expect(c.waitTime).toBe(Math.floor(c.density / 5));
    });

    restrooms.forEach(r => {
      // Density / 10
      expect(r.waitTime).toBe(Math.floor(r.density / 10));
    });

    gates.forEach(g => {
      // Density / 8
      expect(g.waitTime).toBe(Math.floor(g.density / 8));
    });
  });
});
