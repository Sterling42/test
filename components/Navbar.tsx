import React from 'react';
import styles from '../styles/Navbar.module.css'; // Import the CSS module

interface NavbarProps {
  xGold: number;
}

const Navbar: React.FC<NavbarProps> = ({ xGold }) => {
  return (
    <div className={styles.navbar}>
      <div>
        <button className={styles.button}>Arena</button>
        <button className={styles.button}>Quests</button>
        <button className={styles.button}>Camp</button>
        <button className={styles.button}>Guild</button>
        <button className={styles.button}>Shop</button>
        <button className={styles.button}>Leaderboard</button>
        <button className={styles.button}>Refferals</button>
        <button className={styles.button}>FAQ</button>
      </div>
      <span>Gold: {xGold}</span>
    </div>
  );
};

export default Navbar;