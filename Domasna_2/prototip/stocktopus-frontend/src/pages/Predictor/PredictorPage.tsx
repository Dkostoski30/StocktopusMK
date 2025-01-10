import React, { useState, useEffect } from "react";
import styles from './PredictorPage.module.css';
import Navigation from "../../components/navigation/Navigation.tsx";
import logo from '../../assets/logo.png';
import { UserProfile } from "../../components/userProfile/UserProfile.tsx";
import { Footer } from "../../components/footer/Footer.tsx";
import { Link as RouterLink } from "react-router-dom";
import { findAll } from "../../service/stockService.ts";
import { StockDTO } from "../../model/dto/stockDTO.ts";
import {isAdmin} from "../../config/jwtToken.ts";
import { ICONS } from "../../config/icons.ts";

const sidebarItemsAdmin = [
    { label: 'Home Page', path: '/', icon: ICONS.homePage, isActive: false },
    { label: 'Admin Dashboard', path: '/admin/stockdetails', icon: ICONS.adminDashboard, isActive: false },
    { label: 'Favorites', path: '/favorites', icon: ICONS.favorites, isActive: false },
    { label: 'AI Predictor', path: '/predictor', icon: ICONS.aiPredictor, isActive: true },
    { label: 'Sign out', path: '/login', icon: ICONS.signOut, isActive: false },
];

const sidebarItemsUser = [
    { label: 'Home Page', path: '/', icon: ICONS.homePage, isActive: false },
    { label: 'Favorites', path: '/favorites', icon: ICONS.favorites, isActive: false },
    { label: 'AI Predictor', path: '/predictor', icon: ICONS.aiPredictor, isActive: true },
    { label: 'Stocks', path: '/user/stocks', icon: ICONS.stocks, isActive: false },
    { label: 'Sign out', path: '/login', icon: ICONS.signOut, isActive: false },
];

const ITEMS_PER_PAGE = 12;

export const Predictor: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [stocks, setStocks] = useState<StockDTO[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [filterData, setFilterData] = useState({ stockName: '' });


    const fetchStocks = async () => {

        try {
            const response = await findAll({ page: currentPage, size: ITEMS_PER_PAGE, ...filterData });
            setTotalCount(response.totalElements);
            setStocks(response.content);
        } catch (error) {
            console.error("Error loading stocks:", error);
        }
    };

    useEffect(() => {
        fetchStocks();
    }, [currentPage, filterData]);

    const totalPages = Math.floor(totalCount / ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

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
                                    src={ICONS.searchIcon}
                                    alt="" className={styles.searchIcon} />
                                <input
                                    id="search"
                                    type="search"
                                    placeholder="Search by stock name..."
                                    className={styles.searchInput}
                                    onChange={(e) => setFilterData({ stockName: e.target.value })}
                                />
                            </form>
                        </div>

                        <UserProfile/>
                    </header>
                    <div className={styles.cardGrid}>
                        {stocks.map(stock => (
                            <div key={stock.stockId} className={styles.card}>
                                <h2>{stock.fullName}</h2>
                                <RouterLink to={`/predictor/${stock.stockId}`}>View Details</RouterLink>
                            </div>
                        ))}
                    </div>

                    <div className={styles.pagination}>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                className={i + 1 === currentPage ? styles.activePage : ''}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
};