import React, {useState} from 'react';
import styles from '../pages/AdminDashboard/AdminDashboard.module.css';

interface FilterFormStocksProps {
    onSubmit: (data: { stockName: string }) => void
}

export const FilterFormStocks: React.FC<FilterFormStocksProps> = ({onSubmit}) => {
    const [stockName, setstockName] = useState<string>('');

    const handlestockNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setstockName(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit({stockName});
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
                    onChange={handlestockNameChange}
                />
            </div>

            <button type="submit" className={styles.submitButton}>Search</button>
        </form>
    );
};
