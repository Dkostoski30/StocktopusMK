import React from 'react';
import styles from './AdminDashboard.module.css';
import { FilterForm } from '../../components//FilterForm';
import {StockDetailsTable} from "../../components/table-historic-data/StockDetailsTable";
import Navigation from "../../components/navigation/Navigation.tsx";
import logo from "../../assets/logo.png";
import {Footer} from "../../components/footer/Footer.tsx";
import {UserProfile} from "../../components/UserProfile.tsx";

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
        path: '/admin/historic-data', // Path for Historic Data
        isActive: true,
    },
    {
        icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/b328694d610eca444166961c972325a5cd97af94df16694bcf61bff11793da87?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078',
        label: 'Stocks',
        path: '/admin/stocks', // Path for Stocks
        isActive: false,
    },
    {
        icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/170996ea976592f23f0dc12558b6946a7ce322f5ecff2f0a0341da620be554d6?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078',
        label: 'Users',
        path: '/admin/users', // Path for Users
        isActive: false,
    },
    {
        icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/3a442f00011bfdbf7a7cab35a09d701dda8da4ee43a4154bdc25a8467e88124b?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078',
        label: 'Back to Home Page',
        path: '/', // Path to go back to Home Page
        isActive: false,
    },
];

// const adminDashboard: HistoricDataItem[] = [
//     {
//         ticker: 'KMB',
//         date: '23/09/2022',
//         max: '24.300,00',
//         min: '24.200,00',
//         lastPrice: '24.200,00',
//         iconSrc: 'https://cdn.builder.io/api/v1/image/assets/TEMP/78afbf77b7283a2ab4d0498aaa3ac5465213ab2b58eb75d671c400a4b5d1ade8?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078'
//     },
// ];

export const AdminDashboard: React.FC = () => {

    // TODO: Implement the following functions
    // const handleSignOut = () => {
    //     // Handle sign out logic
    // };
    //
    // const handleEdit = () => {
    //     // Handle edit logic
    // };
    //
    // const handleDelete = () => {
    //     // Handle delete logic
    // };

    const handleFilter = () => {
        // TODO Handle filter logic
    };

    return (
        <main className={styles.dashboardDesign}>
            <div className={styles.layout}>
                <nav className={styles.sidebar}>
                    <div className={styles.logo}>
                        <img src={logo} alt="Stocktopus logo" className={styles.logoImage}/>
                        <h1 className={styles.logoText}>Stocktopus</h1>
                    </div>

                    <Navigation items={sidebarItems}/>
                </nav>
                <section className={styles.content}>
                    <header className={styles.contentHeader}>
                        <h2 className={styles.pageTitle}>Historic data</h2>
                        <UserProfile
                            name="Daniela"
                            role="Admin"
                            imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/1755c11e7b6a7afcce83903ab9166d8511e788b72277ae143f1158a138de7f56?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078"
                        />
                    </header>
                    <FilterForm onSubmit={handleFilter}/>
                    <StockDetailsTable/>
                </section>
            </div>
            <Footer/>
        </main>
    );
};