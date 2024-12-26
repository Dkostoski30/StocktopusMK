import React, { useState, useEffect } from 'react';
import styles from './Users.module.css';
import { FilterForm } from '../../components/FilterForm';
import { StockDetailsTable } from "../../components/table-historic-data/StockDetailsTable";
import Navigation from "../../components/navigation/Navigation";
import logo from "../../assets/logo.png";
import { Footer } from "../../components/footer/Footer";
import { UserProfile } from "../../components/UserProfile";
import UserTable from '../../components/users-table/UsersTable'; // Import the UserTable component

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
        isActive: false,
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
        isActive: true,
    },
    {
        icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/3a442f00011bfdbf7a7cab35a09d701dda8da4ee43a4154bdc25a8467e88124b?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078',
        label: 'Back to Home Page',
        path: '/', // Path to go back to Home Page
        isActive: false,
    },
];

export const Users: React.FC = () => {
    const [filterData, setFilterData] = useState({ stockName: '', dateFrom: '', dateTo: '' });
    const [users, setUsers] = useState<{ username: string; mail: string; role: string }[]>([]);

    const handleFilter = (data: { stockName: string; dateFrom: string; dateTo: string }) => {
        setFilterData(data);
    };

    useEffect(() => {
        // This is where you will fetch data from your API in the future
        // For now, we'll use some dummy data
        const dummyUsers = [
            { username: 'johndoe', mail: 'johndoe@example.com', role: 'admin' },
            { username: 'janedoe', mail: 'janedoe@example.com', role: 'user' },
        ];
        setUsers(dummyUsers);
    }, []);

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
                        <h2 className={styles.pageTitle}>Users</h2>
                        <UserProfile
                            name="Daniela"
                            role="Admin"
                            imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/1755c11e7b6a7afcce83903ab9166d8511e788b72277ae143f1158a138de7f56?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078"
                        />
                    </header>
                    <UserTable users={users} />
                </section>
            </div>
            <Footer />
        </main>
    );
};
