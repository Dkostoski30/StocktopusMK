import styles from './Favorites.module.css';
import { UserProfile } from '../../components/userProfile/UserProfile.tsx';
import Navigation from "../../components/navigation/Navigation.tsx";
import logo from '../../assets/logo.png';
import {Footer} from "../../components/footer/Footer.tsx";

import {FavoritesSection} from "../../components/Favorites/FavoritesSection.tsx";
import {getUsernameFromToken, isAdmin} from '../../config/jwtToken.ts'
import {ICONS} from "../../config/icons.ts";

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


                        <div className={styles.searchWrapper}>
                            <form className={styles.searchForm} role="search">
                                <img
                                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/179581b66afe025dc77ca49045dc08f9859e92dee37dd974a66344b3140b3b04?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078"
                                    alt="" className={styles.searchIcon}/>
                                {/*<label htmlFor="search" className="visually-hidden">Search</label>*/}
                                <input
                                    id="search"
                                    type="search"
                                    placeholder="Search here..."
                                    className={styles.searchInput}
                                />
                            </form>
                        </div>

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