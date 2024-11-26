import React from 'react';
import styles from './HistoricData.module.css';
import { SidebarItem } from './types';

interface SidebarProps {
    items: SidebarItem[];
    onSignOut: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ items, onSignOut }) => {
    return (
        <aside className={styles.sidebar}>
            <header className={styles.sidebarHeader}>
                <h1 className={styles.dashboardTitle}>
                    Stocktopus Admin<br />Dashboard
                </h1>
                <div className={styles.activeLine} />
            </header>

            <nav className={styles.navigation}>
                {items.map((item, index) => (
                    <a
                        key={index}
                        href="#"
                        className={`${styles.navItem} ${item.isActive ? styles.active : ''}`}
                    >
                        <img src={item.icon} alt="" className={styles.navIcon} />
                        <span>{item.label}</span>
                    </a>
                ))}
            </nav>

            <footer className={styles.sidebarFooter}>
                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/862d2e63579fcaa5b794b694e0012cbed9836472f8cfdb5ead0e8b84211a8afb?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078" alt="" className={styles.footerIcon} />
                <button
                    onClick={onSignOut}
                    className={styles.signOutButton}
                    aria-label="Sign out of dashboard"
                >
                    Sign Out
                </button>
            </footer>
        </aside>
    );
};