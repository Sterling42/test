// Import the necessary functions from the fight.js file
const fs = require('fs');
const { Player, fight } = require('../netlify/functions/fight.js');

// Function to generate random stats for a player
function generateRandomStats() {
    const stats = {
        ATK: Math.floor(Math.random() * 100) + 1,
        DEF: Math.floor(Math.random() * 100) + 1,
        HP: Math.floor(Math.random() * 100) + 1,
        INT: Math.floor(Math.random() * 100) + 1,
        SPD: Math.floor(Math.random() * 100) + 1,
        END: Math.floor(Math.random() * 100) + 1,
        CRIT: Math.floor(Math.random() * 100) + 1,
        LUCK: Math.floor(Math.random() * 100) + 1,
        DGN: Math.floor(Math.random() * 100) + 1,
    };
    stats.totalPower = Object.values(stats).reduce((a, b) => a + b, 0);
    return stats;
}
// Function to simulate a fight between two players with random stats
function simulateFights(numFights) {
    let results = [];

    for (let i = 0; i < numFights; i++) {
        const p1Stats = generateRandomStats();
        const p2Stats = generateRandomStats();
        const p1 = new Player(p1Stats);
        const p2 = new Player(p2Stats);
        const { result } = fight(p1, p2);
        results.push({ p1Stats, p2Stats, result });
    }

    return results;
}

// Function to simulate a large number of fights and collect the results
const numFights = 100000;
const results = simulateFights(numFights);
const output = results.map(result => 
    `User stats: ${JSON.stringify(result.p1Stats)}, ` +
    `Enemy stats: ${JSON.stringify(result.p2Stats)}, ` +
    `Result: ${result.result}\n`
).join('');

fs.writeFile('simulation_results.txt', output, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
});