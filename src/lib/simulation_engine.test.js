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
});
