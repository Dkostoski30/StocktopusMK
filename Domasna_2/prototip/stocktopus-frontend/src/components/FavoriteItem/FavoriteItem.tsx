import React from 'react';
import styles from '../../pages/Index/Dashboard.module.css';
import { FavoriteItemProps } from './types';

export const FavoriteItem: React.FC<FavoriteItemProps> = ({ rank, symbol, maxPrice, avgPrice }) => {
    return (
        <div className={styles.favoriteRow}>
            <div className={styles.favoriteInfo}>
                <span>{rank}</span>
                <a href={`/stock/${symbol}`} className={styles.favoriteSymbol}>{symbol}</a>
            </div>
            <span className={styles.favoritePrice}>{maxPrice}</span>
            <span className={styles.favoritePrice}>{avgPrice}</span>
        </div>
    );
};