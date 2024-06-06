import { FC } from 'react'
import styles from '../styles/Home.module.css'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Image from 'next/image'

interface AppBarProps {
  xGold: number;
}

export const AppBar: FC<AppBarProps> = ({ xGold }) => {
    return (
        <div className={styles.AppHeader}>
            <Image src="/solanaLogo.png" height={30} width={200} />
            <span>WalletRPG</span>
            <span>Gold: {xGold}</span>
            <WalletMultiButton />
        </div>
    )
}