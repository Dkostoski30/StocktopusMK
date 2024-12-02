import React from 'react';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.bottomBar}>
                <p>© {new Date().getFullYear()} StocktopusMK. All rights reserved.</p>
            </div>
        </footer>
    );
};
