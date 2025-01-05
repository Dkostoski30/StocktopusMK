import React, {useEffect, useState} from 'react';
import styles from './Favorites.module.css';
import { UserProfile } from '../../components/UserProfile';
import Navigation from "../../components/navigation/Navigation.tsx";
import logo from '../../assets/logo.png';
import {Footer} from "../../components/footer/Footer.tsx";
import {StockIndicatorsDTO} from "../../model/dto/stockIndicatorsDTO.ts";
import {findByStockId} from "../../service/stockIndicatorsService.ts";
import {StockDetailsDTO} from "../../model/dto/stockDetailsDTO.ts";

import {FavoritesSection} from "../../components/Favorites/FavoritesSection.tsx";
import {getUsernameFromToken, isAdmin} from '../../config/jwtToken.ts'


const favoriteData = [

];

const sidebarItemsAdmin = [
    { label: 'Home Page', path: '/', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/3a442f00011bfdbf7a7cab35a09d701dda8da4ee43a4154bdc25a8467e88124b?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', isActive: false },
    { label: 'Admin Dashboard', path: '/admin/stockdetails', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/f82a8295d3dcfe19d1110553350c5151b3590b9747973a89f58114ed3ae4775d?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', isActive: false},
    { label: 'Favorites', path: '/favorites', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/e5e2117fd75d3701dbf88f7e792aa11874d249c73d02332b8a2aaed30bc7475c?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', isActive: true },
    { label: 'AI Predictor', path: '/predictor', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/9857e2e6d9091abf3f92f025fee0e2f66291bd116bf07d3836751ece1b8653e8?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', isActive: false },
    { label: 'Sign out', path: '/login', icon: 'https://img.icons8.com/?size=100&id=100528&format=png&color=000000', isActive: false},
];

const sidebarItemsUser = [
    { label: 'Home Page', path: '/', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/3a442f00011bfdbf7a7cab35a09d701dda8da4ee43a4154bdc25a8467e88124b?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', isActive: false },
    { label: 'Favorites', path: '/favorites', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/e5e2117fd75d3701dbf88f7e792aa11874d249c73d02332b8a2aaed30bc7475c?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', isActive: true },
    { label: 'AI Predictor', path: '/predictor', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/9857e2e6d9091abf3f92f025fee0e2f66291bd116bf07d3836751ece1b8653e8?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', isActive: false },
    { icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/b328694d610eca444166961c972325a5cd97af94df16694bcf61bff11793da87?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', label: 'Stocks', path: '/user/stocks', isActive: false },
    { label: 'Sign out', path: '/login', icon: 'https://img.icons8.com/?size=100&id=100528&format=png&color=000000', isActive: false},
];

const colors = ['rgba(104,75,192,0.51)', 'rgba(187,124,72,0.5)', 'rgba(54,162,235,0.5)', 'rgba(255,206,86,0.5)'];
export const Favorites: React.FC = () => {
    const [stockIndicatorsData, setStockIndicatorsData] = useState<StockIndicatorsDTO[]>([]);
    const [bestFour, setBestFour] = useState<{ stockId: string; symbol: string; percentage: string }[]>([]);
    const [stockData, setStockData] = useState<{ stockId: string; symbol: string; percentage: string; id : number }[]>([]);
    const [mostTradedData, setMostTradedData] = useState<StockDetailsDTO[]>([]);

    useEffect(() => {
        const fetchIndicatorsById = async () => {
            try {
                if (stockData.length > 0) {
                    const allStockIndicators = await Promise.all(
                        stockData.map(stock => findByStockId(stock.id))
                    );
                    const combinedIndicators = allStockIndicators.flat();
                    setStockIndicatorsData(combinedIndicators);
                }
            } catch (error) {
                console.error("Error fetching stock indicators by ID:", error);
            }
        };

        fetchIndicatorsById();
    }, [stockData]);

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