import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import styles from '../styles/Home.module.css';
import { AppBar } from '../components/AppBar';
import Head from 'next/head';

const Home = () => {
  const { publicKey } = useWallet();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (publicKey) {
      setLoading(true);
      fetch(`/api/users/${publicKey.toString()}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('User not found');
          }
          return res.json();
        })
        .then((data) => {
          setUser(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
          setLoading(false);
        });
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [publicKey]);

  const registerUser = () => {
    fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ walletAddress: publicKey.toString() }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to register user');
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error('Error registering user:', error);
      });
  };

  return (
    <div className={styles.App}>
      <Head>
        <title>WalletRPG</title>
        <meta name="description" content="Wallet-Adapter" />
        <link rel="icon" href="/sol.ico" />
      </Head>
      <AppBar />
      {loading ? (
        <p>Loading...</p>
      ) : user && user.stats ? (
        <div>
          <h2>Stats</h2>
          <p>ATK: {user.stats.ATK}</p>
          <p>DEF: {user.stats.DEF}</p>
          <p>HP: {user.stats.HP}</p>
        </div>
      ) : (
        <button onClick={registerUser}>Register</button>
      )}
    </div>
  );
};

export default Home;
