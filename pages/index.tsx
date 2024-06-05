import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import { AppBar } from '../components/AppBar';
import { UserStats } from '../components/UserStats';
import { GoldXPBar } from '../components/GoldXPBar'; // Import the GoldXPBar component
import Head from 'next/head';
import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';

const Home: NextPage = (props) => {
  const { publicKey } = useWallet();
  const [userStats, setUserStats] = useState(null);
  const [xGold, setXGold] = useState(0);
  const [XP, setXP] = useState(0);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (publicKey) {
        try {
          const response = await axios.get(`/api/user`, { params: { walletAddress: publicKey.toString() } });
          if (response.data.success) {
            setUserStats(response.data.data.stats);
            setXGold(response.data.data.xGold);
            setXP(response.data.data.XP);
          } else if (response.data.message === 'User not found') {
            // If the user does not exist, send a POST request to create the user
            const response = await axios.post(`/api/user`, { walletAddress: publicKey.toString() });
            setUserStats(response.data.data.stats);
            setXGold(response.data.data.xGold);
            setXP(response.data.data.XP);
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
      {userStats && (
        <>
          <GoldXPBar 
            xGold={xGold} 
            XP={XP} 
            setCurrencies={(newXGold, newXP) => {
              setXGold(newXGold);
              setXP(newXP);
            }} 
            userStats={userStats} // Add the userStats prop
          />
          <UserStats
            walletAddress={publicKey.toString()}
            stats={userStats}
            setUserStats={setUserStats}
          />
        </>
      )}
    </div>
  );
};

export default Home;