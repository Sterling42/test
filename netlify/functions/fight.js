// netlify/functions/fight.js
//p1 is User, p2 is Enemy
// Define the type for a player
const Player = function(stats) {
    this.ATK = stats.ATK * 2;
    this.DEF = 1 * stats.DEF / (1 + 0.1 * stats.DEF); // Modified formula for DEF
    this.HP = stats.HP * 50;
    this.INT = stats.INT * 2;
    this.SPD = stats.SPD;
    this.END = stats.END * 5;
    this.CRIT = 1.5 * stats.CRIT / (1 + 0.1 * stats.CRIT);
    this.LUCK = 0.5 * stats.LUCK / (1 + 0.1 * stats.LUCK);
    this.DGN = 1 * stats.DGN / (1 + 0.1 * stats.DGN);
};

// Define the calculateDamage function
const calculateDamage = (attacker, defender, useMagic = false) => {
    let baseDamage = useMagic ? attacker.INT * 2 : attacker.ATK * 2;
    let effectiveDamage = baseDamage;
    let log = [`Base damage: ${baseDamage}`];

    // Apply DGN
    if (attacker.DGN > 0) {
        if (Math.random() < 0.5) {
            effectiveDamage *= 1 + (1 / (1 + 0.1 * attacker.DGN));
            log.push(`DGN increased damage to ${effectiveDamage}`);
        } else {
            effectiveDamage *= 1 - (1 / (1 + 0.1 * attacker.DGN));
            log.push(`DGN decreased damage to ${effectiveDamage}`);
        }
    }

    // Apply CRIT
    if (Math.random() < attacker.LUCK / 100) {
        effectiveDamage *= attacker.CRIT;
        log.push(`CRIT increased damage to ${effectiveDamage}`);
    }

    // Apply LUCK dodge
    let luckPercentage = defender.LUCK;
    if (Math.random() < luckPercentage / 100) {
        effectiveDamage = 0;  // Dodged attack
        log.push(`LUCK dodged the attack`);
    }

    // Apply DEF
    effectiveDamage *= (1 - defender.DEF / 100);
    log.push(`DEF reduced damage to ${effectiveDamage}`);

    // Apply END
    if (attacker.END > 0) {
        attacker.END -= 1;
        log.push(`END is positive, no reduction in damage`);
    } else {
        effectiveDamage *= 0.95;
        log.push(`END is zero, damage reduced to ${effectiveDamage}`);
    }

    if (effectiveDamage < 0) effectiveDamage = 0;

    return { damage: effectiveDamage, log };
};

// Define the fight function
const fight = (User, Enemy) => {
  let baseInterval = 2;
  let time = 0;
  
  let p1Interval = baseInterval / User.SPD;
  let p2Interval = baseInterval / Enemy.SPD;
  
  let p1NextAttack = p1Interval;
  let p2NextAttack = 0;  // Enemy starts first
  
  let fightLog = [];
  
  let p1Attacks = 0;
  let p2Attacks = 0;
  
  while (User.HP > 0 && Enemy.HP > 0) {
    if (p2NextAttack <= time) {
      let { damage, log } = calculateDamage(Enemy, User);
      User.HP -= damage;
      p2NextAttack += p2Interval;
      p2Attacks += 1;
      fightLog.push(`Enemy deals ${damage} damage to User. User's HP is now ${User.HP}.`, ...log);
    }
    
    if (User.HP <= 0) {
      break;
    }
    
    if (p1NextAttack <= time) {
      let { damage, log } = calculateDamage(User, Enemy);
      Enemy.HP -= damage;
      p1NextAttack += p1Interval;
      p1Attacks += 1;
      fightLog.push(`User deals ${damage} damage to Enemy. Enemy's HP is now ${Enemy.HP}.`, ...log);
    }
    
    time += 0.01;  // Increment time
  }
  
  let result;
  if (User.HP <= 0 && Enemy.HP <= 0) {
    result = "It's a draw!";
  } else if (User.HP <= 0) {
    result = "Enemy wins!";
  } else {
    result = "User wins!";
  }
  
  return {
    result,
    fightLog
  };
};

const { MongoClient, ObjectID } = require('mongodb');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { userId, enemyId } = JSON.parse(event.body);

  // Connect to the MongoDB client
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();

// Fetch the user and enemy stats from the database
const db = client.db(process.env.DB_NAME);
const User = await db.collection('users').findOne({ walletAddress: userId });
const Enemy = await db.collection('users').findOne({ walletAddress: enemyId }); // enemyId is now the wallet address of a random user

// Convert player stats to Player objects
const p1 = new Player(User.stats);
const p2 = new Player(Enemy.stats);

const { result, fightLog } = fight(p1, p2);

// Update user's XP based on the result
let xpGain;
if (result === "User wins!") {
  xpGain = 50;
} else if (result === "Enemy wins!") {
  xpGain = 5;
} else {
  xpGain = 0;  // No XP gain in case of a draw
}

await db.collection('users').updateOne(
  { walletAddress: userId },
  { $inc: { 'XP': xpGain } }
);

// Close the MongoDB connection
await client.close();

return {
  statusCode: 200,
  body: JSON.stringify({ result, fightLog, enemyStats: Enemy.stats, xpGain }),
};
};