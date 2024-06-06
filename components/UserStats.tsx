// UserStats.tsx
import { FC, useState } from 'react';
import axios from 'axios';
import Image from 'next/image'; // Import the Image component
import { Item, items } from './Items'; // Import the Item component and items array
import styles from '../styles/Home.module.css';
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

export const UserStats: FC<UserStatsProps> = ({ walletAddress, stats, setUserStats, xGold, XP, setCurrencies }) => {
  const [showFightModal, setShowFightModal] = useState(false);

  const handleFightClick = () => {
    setShowFightModal(true);
  };

  const handleCloseModal = () => {
    console.log('Close button clicked');
    setShowFightModal(false);
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
    try {
      const response = await axios.put(`/api/user`, {
        walletAddress,
        stats: updatedStats,
      });
      setUserStats(response.data.data.stats);
    } catch (err) {
      console.error('Error updating user stats:', err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className={styles.Stats}>
      <div className={styles.CharacterStats}>
        {/* Character Image */}
        <div className={styles.CharacterImage}>
          <Image src={characterImage} alt="Character" layout="fill" objectFit="contain" />
        </div>
        {/* Level */}
        <p style={{ marginRight: '25px' }}>Level: {level}</p>
        {/* XP Bar */}
        <div className={styles.XPBar}>
          <div className={styles.XPBarProgress} style={{ width: `${progress * 100}%` }} />
        </div>
        {/* Fight Button */}
        <button onClick={handleFightClick}>Fight</button>
      </div>
      {/* Other components */}
      {showFightModal && <FightModal onClose={handleCloseModal} userId={walletAddress} />}
      <div className={styles.Items}>
        {items.map(item => (
          <Item key={item.id} {...item} />
        ))}
      </div>
      <div className={styles.StatsInfo}>
        {Object.keys(stats).map((stat) => (
          <div key={stat} className={styles.StatRow}>
            <p title={statDescriptions[stat]}>
              {stat}:
              <br />
              Level {stats[stat]}
              <br />
              ({statScalings[stat](stats[stat])})
            </p>
            <button onClick={() => handleIncrement(stat)} className={styles.StatButton}>+1</button>
          </div>
        ))}
      </div>
    </div>
  );
};