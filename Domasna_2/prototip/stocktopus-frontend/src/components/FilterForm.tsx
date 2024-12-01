import React from 'react';
import styles from '../pages/AdminDashboard/AdminDashboard.module.css';

interface FilterFormProps {
    onSubmit: (data: { ticker: string; dateFrom: string; dateTo: string }) => void;
}

export const FilterForm: React.FC<FilterFormProps> = ({ onSubmit }) => {
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
                <label htmlFor="ticker" className={styles.filterLabel}>Ticker name</label>
                <input
                    type="text"
                    id="ticker"
                    name="ticker"
                    className={styles.filterInput}
                    placeholder="Insert ticker name"
                />
            </div>

            <div className={styles.filterGroup}>
                <label htmlFor="dateFrom" className={styles.filterLabel}>Date from</label>
                <input
                    type="date"
                    id="dateFrom"
                    name="dateFrom"
                    className={styles.filterInput}
                    placeholder="Start date"
                />
            </div>

            <div className={styles.filterGroup}>
                <label htmlFor="dateTo" className={styles.filterLabel}>Date to</label>
                <input
                    type="date"
                    id="dateTo"
                    name="dateTo"
                    className={styles.filterInput}
                    placeholder="End date"
                />
            </div>
        </form>
    );
};