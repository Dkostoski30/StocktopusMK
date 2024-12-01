import React from 'react';
import styles from '../pages/AdminDashboard/HistoricData.module.css';
import { SidebarItem } from './types';
import {Link} from "react-router-dom";

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

            <nav className={styles.navigation} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2rem auto' }}>
                {items.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className={`${styles.navItem} ${
                            item.isActive ? styles.active : ''
                        }`}
                        style={{ margin: '0.3rem auto' }}
                    >
                        <img
                            src={item.icon}
                            alt=""
                            className={styles.navIcon}
                        />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            <footer className={styles.sidebarFooter} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: '2rem auto' }}>
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