// FightModal.tsx
import { FC, useState, useEffect, useRef } from 'react';
import styles from '../styles/Home.module.css';

interface FightModalProps {
  onClose: () => void;
  userStats: Record<string, number>; // Add userStats prop
}

const statNames = ['ATK', 'DEF', 'HP', 'INT', 'SPD', 'END', 'CRIT', 'LUCK', 'DGN'];

const generateRandomStat = () => Math.floor(Math.random() * 100) + 1;

export const FightModal: FC<FightModalProps> = ({ onClose, userStats }) => {
  const [dummyStats, setDummyStats] = useState({});
  const isMounted = useRef(true); // Ref to keep track of whether the component is mounted

  useEffect(() => {
    // Set isMounted to false when the component unmounts
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const stats = {};
    statNames.forEach((stat) => {
      stats[stat] = generateRandomStat();
    });
    if (isMounted.current) { // Only update the state if the component is still mounted
      setDummyStats(stats);
    }
  }, []);

  return (
    <div className={styles.FightModal}>
      <div className={styles.FightModalContent}>
        <div className={styles.statsContainer}>
          <div>
            <h1>Target Dummy</h1>
            {statNames.map((stat) => (
              <p key={stat}>{stat}: {dummyStats[stat]}</p>
            ))}
          </div>
          <div>
            <h1>User Stats</h1>
            {statNames.map((stat) => (
              <p key={stat}>{stat}: {userStats[stat]}</p>
            ))}
          </div>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};