import React, { useState, useEffect } from "react";
import styles from './PredictorPage.module.css';
import Navigation from "../../components/navigation/Navigation.tsx";
import logo from '../../assets/logo.png';
import { UserProfile } from "../../components/UserProfile.tsx";
import { Footer } from "../../components/footer/Footer.tsx";
import { Link as RouterLink } from "react-router-dom";
import { getItems } from "../../service/stockService.ts";
import { StockDTO } from "../../model/dto/stockDTO.ts";

const sidebarItems = [
    { label: 'Home Page', path: '/', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/3a442f00011bfdbf7a7cab35a09d701dda8da4ee43a4154bdc25a8467e88124b?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', isActive: false },
    { label: 'Admin Dashboard', path: '/admin/stockdetails', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/f82a8295d3dcfe19d1110553350c5151b3590b9747973a89f58114ed3ae4775d?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', isActive: false },
    { label: 'Favorites', path: '/favorites', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/e5e2117fd75d3701dbf88f7e792aa11874d249c73d02332b8a2aaed30bc7475c?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', isActive: false },
    { label: 'AI Predictor', path: '/predictor', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/9857e2e6d9091abf3f92f025fee0e2f66291bd116bf07d3836751ece1b8653e8?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', isActive: true },
    { label: 'Sign out', path: '/login', icon: 'https://img.icons8.com/?size=100&id=100528&format=png&color=000000', isActive: false },
];

const ITEMS_PER_PAGE = 12;

export const Predictor: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [stocks, setStocks] = useState<StockDTO[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [filterData, setFilterData] = useState({ stockName: '' });


    const fetchStocks = async () => {

        try {
            const response = await getItems({ page: currentPage, size: ITEMS_PER_PAGE, ...filterData });
            setTotalCount(response.totalElements);
            setStocks(response.content);
            console.log(response.content)
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

                    <Navigation items={sidebarItems} />
                </nav>

                <div className={styles.mainContent}>
                    <header className={styles.header}>
                        <div className={styles.searchWrapper}>
                            <form className={styles.searchForm} role="search">
                                <img
                                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/179581b66afe025dc77ca49045dc08f9859e92dee37dd974a66344b3140b3b04?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078"
                                    alt="" className={styles.searchIcon} />
                                <input
                                    id="search"
                                    type="search"
                                    placeholder="Search here..."
                                    className={styles.searchInput}
                                    onChange={(e) => setFilterData({ stockName: e.target.value })}
                                />
                            </form>
                        </div>

                        <UserProfile
                            name="Daniela"
                            role="Admin"
                            imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/1755c11e7b6a7afcce83903ab9166d8511e788b72277ae143f1158a138de7f56?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078"
                        />
                    </header>
                    <div className={styles.cardGrid}>
                        {stocks.map(stock => (
                            <div key={stock.stockId} className={styles.card}>
                                <h2>{stock.fullName}</h2>
                                <p>Model Accuracy: test</p>
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