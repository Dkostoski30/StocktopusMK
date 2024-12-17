import React, { useState } from 'react';
import styles from '../pages/AdminDashboard/AdminDashboard.module.css';

interface FilterFormProps {
    onSubmit: (data: { stockName: string; dateFrom: string; dateTo: string }) => void;
}

export const FilterForm: React.FC<FilterFormProps> = ({ onSubmit }) => {
    const [stockName, setStockName] = useState<string>('');
    const [dateFrom, setDateFrom] = useState<string>('');
    const [dateTo, setDateTo] = useState<string>('');

    const handleStockNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStockName(e.target.value);
    };

    const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateFrom(e.target.value);
    };

    const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateTo(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit({ stockName, dateFrom, dateTo });
    };

    return (
        <form className={styles.filterForm} onSubmit={handleSubmit}>
            <div className={styles.filterGroup}>
                <label htmlFor="stockName" className={styles.filterLabel}>Stock Name</label>
                <input
                    type="text"
                    id="stockName"
                    name="stockName"
                    className={styles.filterInput}
                    placeholder="Insert stock name"
                    value={stockName}
                    onChange={handleStockNameChange}
                />
            </div>

            <div className={styles.filterGroup}>
                <label htmlFor="dateFrom" className={styles.filterLabel}>Date from</label>
                <div className={styles.dateInputContainer}>
                    <input
                        type="date"
                        id="dateFrom"
                        name="dateFrom"
                        className={styles.filterInput}
                        value={dateFrom}
                        onChange={handleDateFromChange}
                    />
                </div>
            </div>

            <div className={styles.filterGroup}>
                <label htmlFor="dateTo" className={styles.filterLabel}>Date to</label>
                <div className={styles.dateInputContainer}>
                    <input
                        type="date"
                        id="dateTo"
                        name="dateTo"
                        className={styles.filterInput}
                        value={dateTo}
                        onChange={handleDateToChange}
                    />
                </div>
            </div>

            <button type="submit" className={styles.submitButton}>Search</button>
        </form>
    );
};