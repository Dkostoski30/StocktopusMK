import React, {useState} from 'react';
import styles from './HistoricData.module.css';
import { FilterForm } from '../../components/FilterForm/FilterForm.tsx';
import {StockDetailsTable} from "../../components/table-historic-data/StockDetailsTable";
import Navigation from "../../components/navigation/Navigation.tsx";
import logo from "../../assets/logo.png";
import {Footer} from "../../components/footer/Footer.tsx";
import {UserProfile} from "../../components/userProfile/UserProfile.tsx";
import {isAdmin} from "../../config/jwtToken.ts";
import {ICONS} from "../../config/icons.ts";

interface SidebarItem {
    icon: string;
    label: string;
    path: string;
    isActive: boolean;
}

const sidebarItemsAdmin: SidebarItem[] = [
    { icon: ICONS.historicData, label: 'Historic data', path: '/admin/historic-data', isActive: true },
    { icon: ICONS.stocks, label: 'Stocks', path: '/admin/stocks', isActive: false },
    { icon: ICONS.users, label: 'Users', path: '/admin/users', isActive: false },
    { icon: ICONS.backToHome, label: 'Back to Home Page', path: '/', isActive: false },
];

const sidebarItemsUser: SidebarItem[] = [
    { icon: ICONS.historicData, label: 'Historic data', path: '/user/historic-data', isActive: true },
    { icon: ICONS.stocks, label: 'Stocks', path: '/user/stocks', isActive: false },
    { icon: ICONS.backToHome, label: 'Back to Home Page', path: '/', isActive: false },
];

export const HistoricData: React.FC = () => {

    const [filterData, setFilterData] = useState({ stockName: '', dateFrom: '', dateTo: '' });

    const handleFilter = (data: { stockName: string; dateFrom: string; dateTo: string }) => {
        setFilterData(data);
    };

    return (
        <main className={styles.dashboardDesign}>
            <div className={styles.layout}>
                <nav className={styles.sidebar}>
                    <div className={styles.logo}>
                        <img src={logo} alt="Stocktopus logo" className={styles.logoImage}/>
                        <h1 className={styles.logoText}>Stocktopus</h1>
                    </div>

                    <Navigation items={isAdmin() ? sidebarItemsAdmin : sidebarItemsUser}/>
                </nav>
                <section className={styles.content}>
                    <header className={styles.contentHeader}>
                        <h2 className={styles.pageTitle}>Historic data</h2>
                        <UserProfile/>
                    </header>
                    <FilterForm onSubmit={handleFilter}/>
                    <StockDetailsTable filterData={filterData} />
                </section>
            </div>
            <Footer/>
        </main>
    );
};