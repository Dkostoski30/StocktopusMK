import React from 'react';
import styles from './LoadingScreen.module.css';

export const LoadingScreen: React.FC = () => {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading...</p>
        </div>
    );
};