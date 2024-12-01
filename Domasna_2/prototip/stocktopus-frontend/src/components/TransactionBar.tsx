import React from 'react';
import styles from '../pages/Index/Dashboard.module.css';
import { TransactionBarProps } from './types';

export const TransactionBar: React.FC<TransactionBarProps> = ({ year, height }) => {
    return (
        <div className={styles.transactionBarWrapper}>
            <div
                className={styles.transactionBar}
                style={{ height: `${height}px` }}
                role="presentation"
                aria-label={`Transactions for year ${year}`}
            />
            <span className={styles.transactionYear}>{year}</span>
        </div>
    );
};