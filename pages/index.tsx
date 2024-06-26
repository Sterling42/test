// index.tsx
import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import { AppBar } from '../components/AppBar';
import { UserStats } from '../components/UserStats';
import Navbar from '../components/Navbar'; // Import the Navbar component
import Head from 'next/head';
import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';

const Home: NextPage = (props) => {
  const { publicKey } = useWallet();
  const [userStats, setUserStats] = useState(null);
  const [xGold, setXGold] = useState(0);
  const [XP, setXP] = useState(0);
  const [wins, setWins] = useState(0); // Add this line
  const [losses, setLosses] = useState(0); // Add this line

  useEffect(() => {
    const fetchUserStats = async () => {
      if (publicKey) {
        try {
          const response = await axios.get(`/api/user`, { params: { walletAddress: publicKey.toString() } });
          if (response.data.success) {
            setUserStats(response.data.data.stats);
            setXGold(response.data.data.xGold);
            setXP(response.data.data.XP);
            setWins(response.data.data.wins); // Add this line
            setLosses(response.data.data.losses); // Add this line
          } else if (response.data.message === 'User not found') {
            // If the user does not exist, send a POST request to create the user
            const response = await axios.post(`/api/user`, { walletAddress: publicKey.toString() });
            setUserStats(response.data.data.stats);
            setXGold(response.data.data.xGold);
            setXP(response.data.data.XP);
            setWins(response.data.data.wins); // Add this line
            setLosses(response.data.data.losses); // Add this line
          }
        } catch (error) {
          console.error('Error fetching user stats:', error);
        }
      }
    };
    fetchUserStats();
  }, [publicKey]);

  return (
    <div className={styles.App}>
      <Head>
        <title>WalletRPG</title>
        <meta name="description" content="Wallet-Adapter" />
        <link rel="icon" href="/sol.ico" />
      </Head>
      <AppBar />
      <Navbar xGold={xGold} userId={publicKey?.toString()} /> {/* Use the Navbar component */}
      {userStats && (
        <UserStats
          walletAddress={publicKey.toString()}
          stats={userStats}
          setUserStats={setUserStats}
          xGold={xGold}
          XP={XP}
          setCurrencies={(newXGold, newXP) => {
            setXGold(newXGold);
            setXP(newXP);
          }}
          wins={wins} // Add this line
          losses={losses} // Add this line
        />
      )}
    </div>
  );
};

export default Home;