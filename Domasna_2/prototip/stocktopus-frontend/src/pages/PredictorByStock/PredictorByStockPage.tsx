import React, { useEffect, useState } from "react";
import styles from './PredictorByStockPage.module.css';
import Navigation from "../../components/navigation/Navigation.tsx";
import logo from '../../assets/logo.png';
import { UserProfile } from "../../components/userProfile/UserProfile.tsx";
import { Footer } from "../../components/footer/Footer.tsx";
import { LatestNewsDTO } from "../../model/dto/latestNewsDTO.ts";
import { getLatestNewsByStockId } from "../../service/latestNewsService.ts";
import { useParams } from "react-router-dom";
import {getStockDTOById} from "../../service/stockService.ts";
import { getPrediction } from "../../service/stockDetailsService.ts";
import {isAdmin} from "../../config/jwtToken.ts";
import { ICONS } from "../../config/icons.ts";
import SearchBar from "../../components/SearchBar/SearchBar.tsx";

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

export const PredictorByStockPage: React.FC = () => {
    const [news, setNews] = useState<LatestNewsDTO[]>([]);
    const [page, setPage] = useState(0);
    const [size] = useState(2);
    const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const { stockId } = useParams<{ stockId: string }>();
    const [stockName, setStockName] = useState<string>("");
    const [stockImage, setStockImage] = useState<string>("");

    useEffect(() => {
        loadItems();
        fetchStockName();
        fetchPrediction();
    }, [page, size,stockId]);

    const fetchStockName = async () => {
        if (stockId) {
            const stockDTO = await getStockDTOById(parseInt(stockId));
            setStockName(stockDTO.fullName);
            setStockImage(`/src/assets/models/stock_${stockId}/stock_${stockId}_plot.png`);
        }
    };
    const loadItems = async () => {
        try {
            const response = await getLatestNewsByStockId({ page, size, stockId: parseInt(stockId || '-1') });
            setNews(response.content);
            setTotalCount(response.totalElements);
        } catch (error) {
            console.error("Error loading stocks:", error);
        }
    };
    const fetchPrediction = async () => {
        if (stockId) {
            const predictionResponse = await getPrediction(parseInt(stockId));
            if (predictionResponse.success) {
                console.log("Prediction response:", predictionResponse.data);
                setPredictedPrice(predictionResponse.data.price_tomorrow);// Set the predicted price
            } else {
                console.error("Error fetching prediction:", predictionResponse.message);
            }
        }
    };
    const truncateText = (text: string, maxLength: number) =>
        text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

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

                    <h2 className={styles.pageTitle}>{stockName}</h2>
                    {predictedPrice !== null && predictedPrice !== undefined && (
                        <div className={styles.predictionContainer}>
                            <h3>Predicted Price Tomorrow: {predictedPrice.toFixed(2)} денари</h3>
                        </div>
                    )}
                    {news.length === 0 ? (
                            <div>
                                <p className={styles.noNewsMessage}>No latest news for this stock</p>
                            </div>
                        ) : (
                    <section className={styles.newsSection}>

                            <>
                                <div className={styles.newsGrid}>
                                    {news.map((item, index) => {
                                        const sentimentClass =
                                            item.sentiment === "Positive"
                                                ? styles.positive
                                                : item.sentiment === "Negative"
                                                    ? styles.negative
                                                    : styles.neutral;

                                        return (
                                            <div key={index} className={`${styles.newsCard} ${sentimentClass}`}>
                                                <p className={styles.newsText}>
                                                    {truncateText(item.text, 250)}
                                                </p>
                                                <p className={styles.newsSentiment}>
                                                    Sentiment: <strong>{item.sentiment}</strong>
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className={styles.pagination}>
                                    <button
                                        onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                                        disabled={page === 0}
                                        className={styles.paginationButton}>
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setPage((prev) => prev + 1)}
                                        disabled={(page + 1) * size >= totalCount}
                                        className={styles.paginationButton}>
                                        Next
                                    </button>
                                </div>
                            </>
                    </section>
                        )}
                    {stockImage && (
                        <div className={styles.stockImageContainer}>
                            <img src={stockImage} alt={stockName} className={styles.stockImage} />
                        </div>
                    )}
                </div>
            </div>
            <Footer/>
        </main>
    );
};
