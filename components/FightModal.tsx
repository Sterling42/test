// FightModal.tsx
// Inside FightModal component
import { FC, useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Import axios
import styles from '../styles/Home.module.css';

interface FightModalProps {
  onClose: () => void;
  userId: string;
}

export const FightModal: FC<FightModalProps> = ({ onClose, userId }) => {
  const [userStats, setUserStats] = useState<Record<string, number>>({}); // Add userStats state
  const [enemyId, setEnemyId] = useState<string | null>(null);
  const [enemyStats, setEnemyStats] = useState<Record<string, number>>({});
  const [fightLog, setFightLog] = useState<string[]>([]);
  const [fightResult, setFightResult] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Fetch user stats when the component mounts
useEffect(() => {
  const fetchUserStats = async () => {
    try {
      const response = await axios.get(`/api/user`, { params: { walletAddress: userId } });
      if (isMounted.current) {
        setUserStats(response.data.data.stats); // Access stats with response.data.data.stats
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  fetchUserStats();
}, [userId]);

  const handleFight = async () => {
    const endpoint = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:8888/.netlify/functions/fight' 
      : '/api/fight';
  
    // Generate a random enemyId
    const enemyId = (Math.floor(Math.random() * 100) + 1).toString();
    setEnemyId(enemyId);
  
    try {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId: userId, enemyId: enemyId }), // Send userId and enemyId instead of stats
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log(data.enemyStats); // Log the enemy stats
  setFightLog(data.fightLog);
  setFightResult(data.result);
  setEnemyStats(data.enemyStats); // Set the enemy stats
} catch (error) {
  console.error('Error fetching fight data:', error);
}
  };

  return (
    <div className={styles.FightModal}>
      <div className={styles.FightModalContent}>
        <div className={styles.statsContainer}>
          <div>
            <h1>Target Dummy</h1>
            {enemyStats && Object.keys(enemyStats).map((stat) => (
              <p key={stat}>{stat}: {enemyStats[stat]}</p>
            ))}
          </div>
          <div>
            <h1>User Stats</h1>
            {userStats && Object.keys(userStats).map((stat) => (
              <p key={stat}>{stat}: {userStats[stat]}</p>
            ))}
          </div>
        </div>
        <button style={{ marginRight: '10px' }} onClick={handleFight}>Fight</button>
        <button onClick={onClose}>Close</button>
        {fightResult && <h2>{fightResult}</h2>}
        <div className={styles.logContainer}>
          {fightLog.map((log, index) => (
            <p key={index}>{log}</p>
          ))}
        </div>
      </div>
    </div>
  );
};