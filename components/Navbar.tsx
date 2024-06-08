import React, { useState } from 'react';
import styles from '../styles/Navbar.module.css'; // Import the CSS module
import { FightModal } from './FightModal'; // Import the FightModal component

interface NavbarProps {
  xGold: number;
  userId: string; // Add this line if userId is not available in this component
}

const Navbar: React.FC<NavbarProps> = ({ xGold, userId }) => {
  const [showFightModal, setShowFightModal] = useState(false);
  const [isPvE, setIsPvE] = useState(true);  // Add this line

  const handleArenaClick = () => {
    setIsPvE(true);  // Set isPvE to true when the Arena button is clicked
    setShowFightModal(true);
  };

  const handleClose = () => {
    setShowFightModal(false);
  };

  return (
    <div className={styles.navbar}>
      <div>
        <button className={styles.button} onClick={handleArenaClick}>Arena</button>
        <button className={styles.button}>Quests</button>
        <button className={styles.button}>Camp</button>
        <button className={styles.button}>Guild</button>
        <button className={styles.button}>Shop</button>
        <button className={styles.button}>Leaderboard</button>
        <button className={styles.button}>Refferals</button>
        <button className={styles.button}>FAQ</button>
      </div>
      <span>Gold: {xGold}</span>
      {showFightModal && <FightModal onClose={handleClose} userId={userId} isPvE={isPvE} />}
    </div>
  );
};

export default Navbar;