import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './StockDetailsPage.module.css';
import Navigation from "../../components/navigation/Navigation.tsx";
import { Footer } from "../../components/footer/Footer.tsx";
import logo from "../../assets/logo.png";
import { UserProfile } from "../../components/UserProfile.tsx";
import { StockDetailsDTO } from "../../model/dto/StockDetailsDTO.ts";
import { getStockDetailsByTicker } from "../../service/stockDetailsService.ts";

interface SidebarItem {
    icon: string;
    label: string;
    path: string;
    isActive: boolean;
}

const sidebarItems: SidebarItem[] = [
    {
        icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/f82a8295d3dcfe19d1110553350c5151b3590b9747973a89f58114ed3ae4775d?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078',
        label: 'Historic data',
        path: '/admin/historic-data',
        isActive: false,
    },
    {
        icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/b328694d610eca444166961c972325a5cd97af94df16694bcf61bff11793da87?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078',
        label: 'Stocks',
        path: '/admin/stocks',
        isActive: false,
    },
    {
        icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/170996ea976592f23f0dc12558b6946a7ce322f5ecff2f0a0341da620be554d6?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078',
        label: 'Users',
        path: '/admin/users',
        isActive: false,
    },
    {
        icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/3a442f00011bfdbf7a7cab35a09d701dda8da4ee43a4154bdc25a8467e88124b?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078',
        label: 'Back to Home Page',
        path: '/',
        isActive: false,
    },
];

export const StockDetailsPage: React.FC = () => {
    const { ticker } = useParams<{ ticker: number }>();
    const [stockDetails, setStockDetails] = useState<StockDetailsDTO[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [stockName, setStockName] = useState(null);

    useEffect(() => {
        const fetchStockDetails = async () => {
            try {
                if (ticker) {
                    const details = await getStockDetailsByTicker(Number(ticker)); // Convert ticker to a number
                    console.log("Fetched stock details:", details); // Debug the response
                    setStockDetails(details); // Set the response to state
                }
            } catch (err) {
                console.error('Error fetching stock details:', err.message);
                setError('Failed to load stock details');
            } finally {
                setIsLoading(false); // Ensure loading is turned off
            }
        };

        fetchStockDetails();
    }, [ticker]); // Only re-run when the `ticker` changes



    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

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
                <section className={styles.content}>
                    <header className={styles.contentHeader}>
                        <h2 className={styles.pageTitle}>{stockName}</h2>
                        <UserProfile
                            name="Daniela"
                            role="Admin"
                            imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/1755c11e7b6a7afcce83903ab9166d8511e788b72277ae143f1158a138de7f56?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078"
                        />
                    </header>
                    <div className={styles.gridContainer}>
                        {stockDetails ? (
                            <div className={styles.card}>
                                <h3>Stock Details</h3>
                                <p>Last Transaction Price: {stockDetails?.lastTransactionPrice}</p>
                                <p>Max Price: {stockDetails?.maxPrice}</p>
                                <p>Min Price: {stockDetails?.minPrice}</p>
                                <p>Average Price: {stockDetails?.averagePrice}</p>
                                <p>Percentage Change: {stockDetails?.percentageChange}</p>
                                <p>Quantity: {stockDetails?.quantity}</p>
                                <p>Trade Volume: {stockDetails?.tradeVolume}</p>
                                <p>Total Volume: {stockDetails?.totalVolume}</p>
                            </div>

                        ) : (
                            <p>No stock details available</p>
                        )}
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    );
};
