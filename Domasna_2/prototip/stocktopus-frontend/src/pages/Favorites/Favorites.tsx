import styles from './Favorites.module.css';
import { UserProfile } from '../../components/userProfile/UserProfile.tsx';
import Navigation from "../../components/navigation/Navigation.tsx";
import logo from '../../assets/logo.png';
import {Footer} from "../../components/footer/Footer.tsx";

import {FavoritesSection} from "../../components/Favorites/FavoritesSection.tsx";
import {getUsernameFromToken, isAdmin} from '../../config/jwtToken.ts'
import {ICONS} from "../../config/icons.ts";
import SearchBar from "../../components/SearchBar/SearchBar.tsx";
import React from "react";

const sidebarItemsAdmin = [
    { label: 'Home Page', path: '/', icon: ICONS.homePage, isActive: false },
    { label: 'Admin Dashboard', path: '/admin/stockdetails', icon: ICONS.adminDashboard, isActive: false },
    { label: 'Favorites', path: '/favorites', icon: ICONS.favorites, isActive: true },
    { label: 'AI Predictor', path: '/predictor', icon: ICONS.aiPredictor, isActive: false },
    { label: 'Sign out', path: '/login', icon: ICONS.signOut, isActive: false },
];

const sidebarItemsUser = [
    { label: 'Home Page', path: '/', icon: ICONS.homePage, isActive: false },
    { label: 'Favorites', path: '/favorites', icon: ICONS.favorites, isActive: true },
    { label: 'AI Predictor', path: '/predictor', icon: ICONS.aiPredictor, isActive: false },
    { label: 'Stocks', path: '/user/stocks', icon: ICONS.stocks, isActive: false },
    { label: 'Sign out', path: '/login', icon: ICONS.signOut, isActive: false },
];

export const Favorites: React.FC = () => {

    return (
        <main className={styles.dashboardDesign}>
            <div className={styles.layout}>
                <nav className={styles.sidebar}>
                    <div className={styles.logo}>
                        <img src={logo} alt="Stocktopus logo" className={styles.logoImage} />
                        <h1 className={styles.logoText}>Stocktopus</h1>
                    </div>

                    <Navigation items={isAdmin() ? sidebarItemsAdmin : sidebarItemsUser}/>
                </nav>

                <div className={styles.mainContent}>
                    <header className={styles.header}>
                        <SearchBar />
                        <UserProfile/>
                    </header>

                        <section className={styles.favoritesSection}>
                            <FavoritesSection username={getUsernameFromToken()}/>
                        </section>
                </div>
            </div>
            <Footer/>
        </main>
    );
};