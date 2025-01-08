import React, {useState} from 'react';
import styles from '../HistoricData/HistoricData.module.css';
import { FilterFormStocks } from '../../components/FilterForm/FilterFormStocks';
import Navigation from "../../components/navigation/Navigation.tsx";
import {StocksTable} from "../../components/stocks-table/StocksTable.tsx";
import logo from "../../assets/logo.png";
import {Footer} from "../../components/footer/Footer.tsx";
import {UserProfile} from "../../components/userProfile/UserProfile.tsx";
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

export const AllStocks: React.FC = () => {

    const [filterData, setFilterData] = useState({ stockName: ''});

    const handleFilter = (data: { stockName: string}) => {
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
                        <h2 className={styles.pageTitle}>Stocks </h2>
                        <UserProfile/>
                    </header>
                    <FilterFormStocks onSubmit={handleFilter}/>
                    <StocksTable filterData={filterData}/>
                </section>
            </div>
            <Footer/>
        </main>
    );
};