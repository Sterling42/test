// GoldXPBar.tsx
import { FC, useState } from 'react';
import { FightModal } from './FightModal';
import styles from '../styles/Home.module.css';

interface GoldXPBarProps {
  xGold: number;
  XP: number;
  setCurrencies: (xGold: number, XP: number) => void;
  userStats: Record<string, number>; // Add userStats prop
}

export const GoldXPBar: FC<GoldXPBarProps> = ({ xGold, XP, setCurrencies, userStats }) => {
  const [showFightModal, setShowFightModal] = useState(false);

  const handleFightClick = () => {
    setShowFightModal(true);
  };

  const handleCloseModal = () => {
    setShowFightModal(false);
  };

  // Render the Gold and XP bar
  return (
    <div className={styles.GoldXPBar}>
      {/* Render the Gold and XP values */}
      <p>Gold: {xGold}</p>
      <button onClick={handleFightClick}>Fight</button>
      <p>XP: {XP}</p>

      {showFightModal && <FightModal onClose={handleCloseModal} userStats={userStats} />}
    </div>
  );
};