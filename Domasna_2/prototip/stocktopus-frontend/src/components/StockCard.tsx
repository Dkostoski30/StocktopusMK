import React from 'react';
import styles from './Dashboard.module.css';
import { StockCardProps } from './types';

export const StockCard: React.FC<StockCardProps> = ({ rank, symbol, percentage }) => {
    return (
        <div className={styles.stockCard}>
            <div className={styles.stockIndicator} />
            <h3 className={styles.stockRank}>#{rank}</h3>
            <p className={styles.stockSymbol}>{symbol}</p>
            <p className={styles.stockPercentage}>{percentage}</p>
        </div>
    );
};