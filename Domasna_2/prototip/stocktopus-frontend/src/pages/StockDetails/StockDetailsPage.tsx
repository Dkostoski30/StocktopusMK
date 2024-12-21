import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './StockDetailsPage.module.css';
import Navigation from "../../components/navigation/Navigation";
import { Footer } from "../../components/footer/Footer";
import logo from "../../assets/logo.png";
import { UserProfile } from "../../components/UserProfile";
import { findLatestByStockId } from '../../service/stockDetailsService';
import { Line } from 'react-chartjs-2';
import {getStockById} from "../../service/stockService.ts";

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
    const { ticker } = useParams<{ ticker: string }>();
    const [stockName, setStockName] = useState<string>("");
    const [stockDetails, setStockDetails] = useState<any[]>([]);

    useEffect(() => {
        const fetchStockDetails = async () => {
            if (ticker) {
                const stockDTO = await getStockById(parseInt(ticker));
                setStockName(stockDTO.stockName);

                const latestDetails = await findLatestByStockId(parseInt(ticker));
                setStockDetails(latestDetails);
            }
        };

        fetchStockDetails().catch(error => console.error('Error fetching stock details:', error));
    }, [ticker]);

    // Chart data configuration
    const chartData = {
        labels: stockDetails.map(detail => detail.date),
        datasets: [
            {
                label: 'Stock Price',
                data: stockDetails.map(detail => detail.lastTransactionPrice),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                tension: 0.4,
            },
        ],
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
                        {stockDetails.length > 0 ? (
                            <Line data={chartData} />
                        ) : (
                            <p>No stock details available for the last 7 days</p>
                        )}
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    );
};
