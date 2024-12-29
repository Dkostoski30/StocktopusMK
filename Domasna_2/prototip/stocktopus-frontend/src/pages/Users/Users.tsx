import React, { useState, useEffect } from 'react';
import styles from './Users.module.css';
import { UsersTable } from '../../components/users-table/UsersTable';
import Navigation from "../../components/navigation/Navigation";
import logo from "../../assets/logo.png";
import { Footer } from "../../components/footer/Footer";
import { UserProfile } from "../../components/UserProfile";
import { fetchAllUsers } from "../../service/userService.ts";
import { UserDetailsDTO } from "../../model/dto/UserDetailsDTO.ts";

interface SidebarItem {
    icon: string;
    label: string;
    path: string;
    isActive: boolean;
}

const sidebarItems: SidebarItem[] = [
    { icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/f82a8295d3dcfe19d1110553350c5151b3590b9747973a89f58114ed3ae4775d?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', label: 'Historic data', path: '/admin/historic-data', isActive: false },
    { icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/b328694d610eca444166961c972325a5cd97af94df16694bcf61bff11793da87?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', label: 'Stocks', path: '/admin/stocks', isActive: false },
    { icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/170996ea976592f23f0dc12558b6946a7ce322f5ecff2f0a0341da620be554d6?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', label: 'Users', path: '/admin/users', isActive: true },
    { icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/3a442f00011bfdbf7a7cab35a09d701dda8da4ee43a4154bdc25a8467e88124b?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', label: 'Back to Home Page', path: '/', isActive: false }
];


export const Users: React.FC = () => {
    const [users, setUsers] = useState<UserDetailsDTO[]>([]);
    const [pagination, setPagination] = useState({ page: 0, size: 10 });
    const [filter, setFilter] = useState({ username: '', email: '', role: '' });

    const fetchUsers = async () => {
        try {
            const { content } = await fetchAllUsers(pagination, filter);
            setUsers(content);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [pagination, filter]);

    const handleFilterChange = (updatedFilter: { username: string; email: string; role: string }) => {
        setFilter(updatedFilter);
        setPagination({ ...pagination, page: 0 }); // Reset to the first page on filter change
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
                        <h2 className={styles.pageTitle}>Users</h2>
                        <UserProfile />
                    </header>
                    <UsersTable users={users}/>
                </section>
            </div>
            <Footer />
        </main>
    );
};
