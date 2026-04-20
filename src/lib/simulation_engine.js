/**
 * Simulation Engine for SmartStadium OS
 * Generates mock real-time data for crowd density and queue times.
 */

const SECTIONS = [
  { id: 'S1', name: 'North Pavilion', type: 'seating' },
  { id: 'S2', name: 'East Stand', type: 'seating' },
  { id: 'S3', name: 'West Stand', type: 'seating' },
  { id: 'S4', name: 'South Hill', type: 'seating' },
  { id: 'C1', name: 'Main Concession (Chai & Samosa)', type: 'concession' },
  { id: 'C2', name: 'Premium Lounge Bar', type: 'concession' },
  { id: 'R1', name: 'Main Gate Restrooms', type: 'restroom' },
  { id: 'G1', name: 'Entrance Gate A', type: 'gate' },
  { id: 'G2', name: 'Entrance Gate B', type: 'gate' },
];

/**
 * Generates an array of stadium sections with randomized metrics for simulation.
 * @returns {Array<{id: string, name: string, type: string, density: number, waitTime: number, status: string, lastUpdated: string}>} Simulated stadium data array.
 */
export const getSimulationData = () => {
  return SECTIONS.map(section => {
    // Generate random density 0-100
    const density = Math.floor(Math.random() * 100);
    
    // Calculate wait time based on density and type
    let waitTime = 0;
    if (section.type === 'concession') waitTime = Math.floor(density / 5);
    if (section.type === 'restroom') waitTime = Math.floor(density / 10);
    if (section.type === 'gate') waitTime = Math.floor(density / 8);

    return {
      ...section,
      density,
      waitTime, // in minutes
      status: density > 80 ? 'HIGH' : density > 40 ? 'MEDIUM' : 'LOW',
      lastUpdated: new Date().toISOString()
    };
  });
};

/**
 * Retrieves the simulated locations of a user's squad/friends within the stadium.
 * @returns {Array<{id: string, name: string, lat: number, lng: number, status: string}>} Array of squad members and their simulated statuses.
 */
export const getSquadLocations = () => {
  return [
    { id: 'U1', name: 'Rahul', lat: 0.1, lng: 0.2, status: 'At Section S1' },
    { id: 'U2', name: 'Priya', lat: -0.1, lng: 0.3, status: 'In Queue @ C1' },
    { id: 'U3', name: 'Amit', lat: 0.05, lng: -0.1, status: 'Near Gate A' },
  ];
};
