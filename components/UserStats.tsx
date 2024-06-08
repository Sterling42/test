// UserStats.tsx
import { FC, useState } from 'react';
import axios from 'axios';
import Image from 'next/image'; // Import the Image component
import { Item, items } from './Items'; // Import the Item component and items array
import styles from '../styles/UserStats.module.css';
import { FightModal } from './FightModal';
import characterImage from '../public/character.png'; // Import your image file here
import { statScalings } from './config';

interface UserStatsProps {
  walletAddress: string;
  stats: {
    [key: string]: number;
  };
  setUserStats: (stats: { [key: string]: number }) => void;
  xGold: number;
  XP: number;
  setCurrencies: (xGold: number, XP: number) => void;
  wins: number; // Add this line
  losses: number; // Add this line
}

const statDescriptions = {
  ATK: 'Determines the base damage your character can deal to opponents.',
  DEF: 'Reduces the amount of damage your character takes from opponents\' attacks.',
  HP: 'Represents the total amount of damage your character can take before they are defeated.',
  INT: 'Magic Damage Scaling and increases XP gained.',
  SPD: 'Determines how quickly your character can attack.',
  END: 'Represents your character\'s stamina, affecting how long they can attack with full power.',
  CRIT: 'Affects your character\'s critical damage modifier.',
  LUCK: 'Influences a variety of factors, such as the chance to land a critical hit, the chance to dodge attacks, or the likelihood of getting more gold.',
  DGN: 'Represents your character\'s degeneration.',
};

export const UserStats: FC<UserStatsProps> = ({ walletAddress, stats, setUserStats, xGold, XP, setCurrencies, wins, losses }) => {
  const [showFightModal, setShowFightModal] = useState(false);

  const handleFightClick = () => {
    setShowFightModal(true);
  };

  const handleCloseModal = async () => {
    console.log('Close button clicked');
    setShowFightModal(false);
  
    // Fetch the updated user stats and currencies from the server
    try {
      const response = await axios.get(`/api/user`, { params: { walletAddress: walletAddress } });
      setUserStats(response.data.data.stats);
      setCurrencies(response.data.data.xGold, response.data.data.XP);
    } catch (err) {
      console.error('Error fetching updated user stats:', err.response ? err.response.data : err.message);
    }
  };

  // Calculate current level and progress towards next level
  let level = 0;
  let xpForNextLevel = 100;
  while (XP >= xpForNextLevel) {
    XP -= xpForNextLevel;
    level++;
    xpForNextLevel *= 1.1; // Each level requires 10% more XP
  }

  // Calculate progress towards next level as a percentage
  const progress = XP / xpForNextLevel;

  const handleIncrement = async (stat: string) => {
    const updatedStats = { ...stats, [stat]: stats[stat] + 1 };
    const totalPower = Object.values(updatedStats).reduce((a, b) => a + b, 0); // Calculate total power
  
    try {
      const response = await axios.put(`/api/user`, {
        walletAddress,
        stats: updatedStats,
        totalPower, // Send total power to the server
      });
      setUserStats(response.data.data.stats);
    } catch (err) {
      console.error('Error updating user stats:', err.response ? err.response.data : err.message);
    }
  };

  // UserStats.tsx
// ... (rest of the code)

return (
  <div className={styles.Stats}>
    <div className={styles.CharacterStats}>
      {/* Total Power */}
      <p>Total Power: {Object.values(stats).reduce((a, b) => a + b, 0)}</p>
      {/* Character Image */}
      <div className={styles.CharacterImage}>
        <Image src={characterImage} alt="Character" layout="fill" objectFit="contain" />
      </div>
      {/* Level */}
      <p>Level: {level}</p>
      {/* XP Bar */}
      <div className={styles.XPBar}>
        <div className={styles.XPBarProgress} style={{ width: `${progress * 100}%` }} />
      </div>
      {/* Fight Button */}
      <button type="button" className={styles['FightButton']} onClick={handleFightClick}>Fight</button>
      {/* Fight Record */}
      <p className={styles.Record}>Record: {wins} - {losses}</p>
    </div>
    {/* Other components */}
    {showFightModal && <FightModal onClose={handleCloseModal} userId={walletAddress} />}
    <div className={styles.Items}>
      {items.map(item => (
        <Item key={item.id} {...item} />
      ))}
    </div>
    <div className={styles.StatsInfo}>
      {['ATK', 'DEF', 'HP', 'INT', 'SPD', 'END', 'CRIT', 'LUCK', 'DGN'].map((stat) => (
        <div key={stat} className={styles.StatRow}>
          <p title={statDescriptions[stat]}>
            {stat}:
            <br />
            Level {stats[stat]}
            <br />
            {typeof statScalings[stat] === 'function' ? 
              `(${(statScalings[stat](stats[stat])).toFixed(['DEF', 'CRIT', 'LUCK', 'DGN'].includes(stat) ? 2 : 0)}${['DEF', 'CRIT', 'LUCK', 'DGN'].includes(stat) ? '%' : ''})` 
              : 'No scaling function found'}
          </p>
          <button type="button" className={styles['StatButton']} onClick={() => handleIncrement(stat)}>+1</button>
        </div>
      ))}
    </div>
  </div>
);
};