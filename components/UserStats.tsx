import { FC } from 'react';
import styles from '../styles/Home.module.css';
import axios from 'axios';

interface UserStatsProps {
  walletAddress: string;
  stats: {
    [key: string]: number;
  };
  setUserStats: (stats: { [key: string]: number }) => void;
}

export const UserStats: FC<UserStatsProps> = ({ walletAddress, stats, setUserStats }) => {

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
      <div style={{display: 'flex'}}>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          {[...Array(4)].map((_, i) => <div key={i} className={styles.EmptyBox} />)}
        </div>
        <img src="/character.png" alt="Character" className={styles.CharacterImage} />
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          {[...Array(4)].map((_, i) => <div key={i} className={styles.EmptyBox} />)}
        </div>
      </div>
      <div className={styles.StatsInfo}>
        {Object.keys(stats).map((stat) => (
          <div key={stat} className={styles.StatRow}>
            <p>{stat}: {stats[stat]}</p>
            <button onClick={() => handleIncrement(stat)} className={styles.StatButton}>+1</button>
          </div>
        ))}
      </div>
    </div>
  );
};  