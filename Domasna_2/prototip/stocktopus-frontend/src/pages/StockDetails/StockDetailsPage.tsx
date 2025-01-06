import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './StockDetailsPage.module.css';
import Navigation from "../../components/navigation/Navigation";
import { Footer } from "../../components/footer/Footer";
import logo from "../../assets/logo.png";
import { UserProfile } from "../../components/UserProfile";
import { findLatestByStockId } from '../../service/stockDetailsService';
import { Line } from 'react-chartjs-2';
import {getStockDTOById} from "../../service/stockService.ts";
import {StockDetailsDTO} from "../../model/dto/stockDetailsDTO.ts";
import {isAdmin} from "../../config/jwtToken.ts";
import { ICONS } from "../../config/icons.ts";

interface SidebarItem {
    icon: string;
    label: string;
    path: string;
    isActive: boolean;
}

const sidebarItemsAdmin: SidebarItem[] = [
    { icon: ICONS.historicData, label: 'Historic data', path: '/admin/historic-data', isActive: false },
    { icon: ICONS.stocks, label: 'Stocks', path: '/admin/stocks', isActive: true },
    { icon: ICONS.users, label: 'Users', path: '/admin/users', isActive: false },
    { icon: ICONS.backToHome, label: 'Back to Home Page', path: '/', isActive: false },
];

const sidebarItemsUser: SidebarItem[] = [
    { icon: ICONS.historicData, label: 'Historic data', path: '/user/historic-data', isActive: false },
    { icon: ICONS.stocks, label: 'Stocks', path: '/user/stocks', isActive: true },
    { icon: ICONS.backToHome, label: 'Back to Home Page', path: '/', isActive: false },
];


export const StockDetailsPage: React.FC = () => {
    const { ticker } = useParams<{ ticker: string }>();
    const [stockName, setStockName] = useState<string>("");
    const [stockDetails, setStockDetails] = useState<StockDetailsDTO[]>([]);

    useEffect(() => {
        const fetchStockDetails = async () => {
            if (ticker) {
                const stockDTO = await getStockDTOById(parseInt(ticker));
                setStockName(stockDTO.stockName);

                const latestDetails = await findLatestByStockId(parseInt(ticker));
                setStockDetails(latestDetails);
            }
        };

        fetchStockDetails().catch(error => console.error('Error fetching stock details:', error));
    }, [ticker]);

    const validDetails = stockDetails.filter(detail => detail.lastTransactionPrice && detail.date);

    const parsePrice = (price : string) => {
        return parseFloat(price.replace(/\./g, '').replace(',', '.'));
    };

    const chartData = {
        labels: validDetails.map(detail => new Date(detail.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Stock Price',
                data: validDetails.map(detail => parsePrice(detail.lastTransactionPrice)),
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
                    <Navigation items={isAdmin() ? sidebarItemsAdmin : sidebarItemsUser}/>
                </nav>
                <section className={styles.content}>
                    <header className={styles.contentHeader}>
                        <h2 className={styles.pageTitle}>{stockName}</h2>
                        <UserProfile/>
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
