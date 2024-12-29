import React, { useEffect, useState } from "react";
import styles from './PredictorByStockPage.module.css';
import Navigation from "../../components/navigation/Navigation.tsx";
import logo from '../../assets/logo.png';
import { UserProfile } from "../../components/UserProfile.tsx";
import { Footer } from "../../components/footer/Footer.tsx";
import { LatestNewsDTO } from "../../model/dto/latestNewsDTO.ts";
import { getLatestNewsByStockId } from "../../service/latestNewsService.ts";
import { useParams } from "react-router-dom";
import {getStockById} from "../../service/stockService.ts";
import { getPrediction } from "../../service/stockDetailsService.ts";
import {isAdmin} from "../../config/jwtToken.ts";

const sidebarItemsAdmin = [
    { label: 'Home Page', path: '/', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/3a442f00011bfdbf7a7cab35a09d701dda8da4ee43a4154bdc25a8467e88124b?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', isActive: false },
    { label: 'Admin Dashboard', path: '/admin/stockdetails', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/f82a8295d3dcfe19d1110553350c5151b3590b9747973a89f58114ed3ae4775d?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', isActive: false},
    { label: 'Favorites', path: '/favorites', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/e5e2117fd75d3701dbf88f7e792aa11874d249c73d02332b8a2aaed30bc7475c?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', isActive: false },
    { label: 'AI Predictor', path: '/predictor', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/9857e2e6d9091abf3f92f025fee0e2f66291bd116bf07d3836751ece1b8653e8?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', isActive: true },
    { label: 'Sign out', path: '/login', icon: 'https://img.icons8.com/?size=100&id=100528&format=png&color=000000', isActive: false},
];

const sidebarItemsUser = [
    { label: 'Home Page', path: '/', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/3a442f00011bfdbf7a7cab35a09d701dda8da4ee43a4154bdc25a8467e88124b?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', isActive: false },
    { label: 'Favorites', path: '/favorites', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/e5e2117fd75d3701dbf88f7e792aa11874d249c73d02332b8a2aaed30bc7475c?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', isActive: false },
    { label: 'AI Predictor', path: '/predictor', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/9857e2e6d9091abf3f92f025fee0e2f66291bd116bf07d3836751ece1b8653e8?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', isActive: true },
    { icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/b328694d610eca444166961c972325a5cd97af94df16694bcf61bff11793da87?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', label: 'Stocks', path: '/user/stocks', isActive: false },
    { label: 'Sign out', path: '/login', icon: 'https://img.icons8.com/?size=100&id=100528&format=png&color=000000', isActive: false},
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
            const stockDTO = await getStockById(parseInt(stockId));
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
                        <div className={styles.searchWrapper}>
                            <form className={styles.searchForm} role="search">
                                <img
                                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/179581b66afe025dc77ca49045dc08f9859e92dee37dd974a66344b3140b3b04?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078"
                                    alt="" className={styles.searchIcon}/>
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
