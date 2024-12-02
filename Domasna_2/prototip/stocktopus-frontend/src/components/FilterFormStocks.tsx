import React from 'react';
import styles from '../pages/AdminDashboard/AdminDashboard.module.css';

interface FilterFormStocksProps {
    onSubmit: (data: { ticker: string; dateFrom: string; dateTo: string }) => void;
}

export const FilterFormStocks: React.FC<FilterFormStocksProps> = ({ onSubmit }) => {
    return (
        <form className={styles.filterForm} onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            /* onSubmit({
                 ticker: formData.get('ticker') as string,
                 dateFrom: formData.get('dateFrom') as string,
                 dateTo: formData.get('dateTo') as string
             });*/
        }}>
            <div className={styles.filterGroup}>
                <label htmlFor="ticker" className={styles.filterLabel}>Stock name</label>
                <input
                    type="text"
                    id="ticker"
                    name="ticker"
                    className={styles.filterInput}
                    placeholder="Insert stock name"
                />
            </div>
        </form>
    );
};