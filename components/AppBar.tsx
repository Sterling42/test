import { FC } from 'react'
import styles from '../styles/AppBar.module.css';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Image from 'next/image'

interface AppBarProps {
}

export const AppBar: FC<AppBarProps> = () => {
    return (
        <div className={styles.AppHeader}>
            <Image src="/solanaLogo.png" alt="" height={30} width={200} />
            <span>WalletRPG</span>
            <WalletMultiButton />
        </div>
    )
}