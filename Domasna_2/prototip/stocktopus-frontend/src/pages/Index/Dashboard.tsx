import React, {useEffect, useState} from 'react';
import styles from './Dashboard.module.css';
import { StockCard } from '../../components/StockCard';
import { UserProfile } from '../../components/userProfile/UserProfile.tsx';
import Navigation from "../../components/navigation/Navigation.tsx";
import {MostTradedTable} from '../MostTradedTable/MostTradedTable.tsx'
import logo from '../../assets/logo.png';
import {Footer} from "../../components/footer/Footer.tsx";
import Chart from "../../components/chart/Chart.tsx";
import {StockIndicatorsDTO} from "../../model/dto/stockIndicatorsDTO.ts";
import {findByStockId} from "../../service/stockIndicatorsService.ts";
import {findBestFour, getMostTraded} from "../../service/stockService.ts";
import {StockDetailsDTO} from "../../model/dto/stockDetailsDTO.ts";

import {FavoritesSection} from "../../components/Favorites/FavoritesSection.tsx";
import ExportTradedButton from "../../components/exportTradedButton/ExportTradedButton.tsx";
import {getUsernameFromToken, isAdmin} from "../../config/jwtToken.ts";
import axiosInstance from "../../config/axiosInstance.ts";
import {ICONS} from "../../config/icons.ts";

const sidebarItemsAdmin = [
    { label: 'Home Page', path: '/', icon: ICONS.homePage, isActive: true },
    { label: 'Admin Dashboard', path: '/admin/stockdetails', icon: ICONS.adminDashboard, isActive: false },
    { label: 'Favorites', path: '/favorites', icon: ICONS.favorites, isActive: false },
    { label: 'AI Predictor', path: '/predictor', icon: ICONS.aiPredictor, isActive: false },
    { label: 'Sign out', path: '/login', icon: ICONS.signOut, isActive: false },
];

const sidebarItemsUser = [
    { label: 'Home Page', path: '/', icon: ICONS.homePage, isActive: true },
    { label: 'Favorites', path: '/favorites', icon: ICONS.favorites, isActive: false },
    { label: 'AI Predictor', path: '/predictor', icon: ICONS.aiPredictor, isActive: false },
    { label: 'Stocks', path: '/user/stocks', icon: ICONS.stocks, isActive: false },
    { label: 'Sign out', path: '/login', icon: ICONS.signOut, isActive: false },
];

const colors = ['rgba(104,75,192,0.51)', 'rgba(187,124,72,0.5)', 'rgba(54,162,235,0.5)', 'rgba(255,206,86,0.5)'];
export const Dashboard: React.FC = () => {
    const [stockIndicatorsData, setStockIndicatorsData] = useState<StockIndicatorsDTO[]>([]);
    const [bestFour, setBestFour] = useState<{ rank: string; symbol: string; percentage: string }[]>([]);
    const [stockData, setStockData] = useState<{ rank: string; symbol: string; percentage: string; id : number }[]>([]);
    const [mostTradedData, setMostTradedData] = useState<StockDetailsDTO[]>([]);
    useEffect(() => {

        const fetchBestFour = async () => {
            try {
                const data = await findBestFour();
                const formattedData = data.map((item: { stockName: string; stockPercentage: number; stockId: number; }, index: number) => ({
                    rank: (index + 1).toString(),
                    symbol: item.stockName,
                    percentage: `${item.stockPercentage}% from yesterday`,
                    id: item.stockId
                }));
                setBestFour(formattedData);
                setStockData(formattedData); // TODO adapt this with bestfour
            } catch (error) {
                console.error("Error fetching best four stocks:", error);
            }
        };
        fetchBestFour();

        const fetchMostTradedData = async () => {
            try {
                const data = await getMostTraded();
                setMostTradedData(data);
                const response = await axiosInstance.get('http://localhost:8080/api/stock-details/getMostTraded');

                if (Array.isArray(response.data)) {
                    const formattedData: StockDetailsDTO[] = response.data.map((stock: StockDetailsDTO) => ({
                        detailsId: stock.detailsId || 0,
                        stockId: stock.stockId || 0,
                        stockName: stock.stockName || "N/A",
                        date: stock.date ? new Date(stock.date) : new Date(),
                        lastTransactionPrice: stock.lastTransactionPrice?.toString() || "0",
                        maxPrice: stock.maxPrice?.toString() || "0",
                        minPrice: stock.minPrice?.toString() || "0",
                        averagePrice: stock.averagePrice?.toString() || "0",
                        percentageChange: stock.percentageChange?.toString() || "0%",
                        quantity: stock.quantity?.toString() || "0",
                        tradeVolume: stock.tradeVolume?.toString() || "0",
                        totalVolume: stock.totalVolume?.toString() || "0",
                    }));

                    setMostTradedData(formattedData);
                } else {
                    console.error("Invalid data format received:", response.data);
                    setMostTradedData([]);
                }
            } catch (error) {
                console.error('Error setting most traded data:', error);
                setMostTradedData([]);
                console.error("Error fetching most traded stocks:", error);
                setMostTradedData([]);
            }
        };

        fetchMostTradedData();
    }, []);

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

                    <section className={styles.stockSection}>
                        <div className={styles.sectionHeader}>
                            <div>
                                <h2 className={styles.sectionTitle}>Today's Top</h2>
                                <p className={styles.sectionSubtitle}>Summary</p>
                            </div>

                        </div>

                        <div className={styles.stockGrid}>
                            {bestFour.map((stock, index) => (
                                <StockCard
                                    key={stock.rank}
                                    {...stock}
                                    color={colors[index % colors.length]}
                                />
                            ))}
                        </div>
                    </section>
                    <section className={styles.tableFavoritesSection}>
                        <section className={styles.stockSection}>
                            <ExportTradedButton/>
                            <MostTradedTable data={mostTradedData}/>
                        </section>

                        <section className={styles.favoritesSection}>
                            <FavoritesSection username={getUsernameFromToken()}/>
                        </section>
                    </section>
                    <div>
                        <h1>Stock Indicators Chart</h1>
                        <Chart data={stockIndicatorsData}/>
                    </div>
                </div>
            </div>
            <Footer/>
        </main>
    );
};