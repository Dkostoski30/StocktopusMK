import React from 'react';
import styles from './HistoricData.module.css';
import { Sidebar } from '../../components/Sidebar';
import { FilterForm } from '../../components//FilterForm';
import { TableRow } from '../../components/TableRow';
import { HistoricDataItem, SidebarItem } from '../../model/dto/stockDetailsDTO.ts';

const sidebarItems: SidebarItem[] = [
    { icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/ad57ba973d6234183fbe582f7b2ad112581cd54f80690691b147994e2370fcf6?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', label: 'Historic Data', isActive: true },
    { icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/b328694d610eca444166961c972325a5cd97af94df16694bcf61bff11793da87?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', label: 'Stocks' },
    { icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/170996ea976592f23f0dc12558b6946a7ce322f5ecff2f0a0341da620be554d6?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', label: 'Users' },
    { icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/3a442f00011bfdbf7a7cab35a09d701dda8da4ee43a4154bdc25a8467e88124b?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', label: 'Back to Home Page' }
];

const adminDashboard: HistoricDataItem[] = [
    {
        ticker: 'KMB',
        date: '23/09/2022',
        max: '24.300,00',
        min: '24.200,00',
        lastPrice: '24.200,00',
        iconSrc: 'https://cdn.builder.io/api/v1/image/assets/TEMP/78afbf77b7283a2ab4d0498aaa3ac5465213ab2b58eb75d671c400a4b5d1ade8?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078'
    },
    // Additional data items would be added here
];

export const HistoricData: React.FC = () => {
    const handleSignOut = () => {
        // Handle sign out logic
    };

    const handleFilter = () => {
        // Handle filter logic
    };

    const handleEdit = () => {
        // Handle edit logic
    };

    const handleDelete = () => {
        // Handle delete logic
    };

    return (
        <main className={styles.admin}>
            <div className={styles.container}>
                <Sidebar items={sidebarItems} onSignOut={handleSignOut} />

                <section className={styles.content}>
                    <header className={styles.contentHeader}>
                        <h2 className={styles.pageTitle}>Historic Data</h2>
                        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/edd0cc2465c67fbbcb27e8435f6e07ee1d14bc6ec7c7c1067b36dbd60fb75071?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078" alt="User profile" className={styles.profileImage} />
                    </header>

                    <FilterForm onSubmit={handleFilter} />

                    <section className={styles.tableContainer}>
                        <header className={styles.tableHeader}>
                            <span>Ticker</span>
                            <span>Date</span>
                            <span>Max</span>
                            <span>Min</span>
                            <span>Price of last transaction</span>
                        </header>

                        {adminDashboard.map((item, index) => (
                            <TableRow
                                key={index}
                                item={item}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </section>
                </section>
            </div>
        </main>
    );
};