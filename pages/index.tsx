import { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import { AppBar } from '../components/AppBar';
import Head from 'next/head';

const Home: NextPage = (props) => {
  return (
    <div className={styles.App}>
      <Head>
        <title>WalletRPG</title>
        <meta name="description" content="Wallet-Adapter" />
        <link rel="icon" href="/sol.ico" />
      </Head>
      <AppBar />
    </div>
  );
};

export default Home;
