import React from 'react';
import styles from './HistoricData.module.css';
import { HistoricDataItem } from './types';

interface TableRowProps {
    item: HistoricDataItem;
    onEdit: (item: HistoricDataItem) => void;
    onDelete: (item: HistoricDataItem) => void;
}

export const TableRow: React.FC<TableRowProps> = ({ item, onEdit, onDelete }) => {
    return (
        <section className={styles.tableRow}>
            <div className={styles.tickerCell}>
                <img src={item.iconSrc} alt={`${item.ticker} icon`} className={styles.tickerIcon} />
                <span className={styles.tickerSymbol}>{item.ticker}</span>
            </div>
            <div className={styles.dataCell}>
                <time dateTime={item.date}>{item.date}</time>
                <span>{item.max}</span>
            </div>
            <span className={styles.priceCell}>{item.min}</span>
            <div className={styles.actionCell}>
                <span className={styles.lastPrice}>{item.lastPrice}</span>
                <button
                    className={styles.deleteButton}
                    onClick={() => onDelete(item)}
                    aria-label={`Delete ${item.ticker} data`}
                >
                    Delete
                </button>
                <button
                    className={styles.editButton}
                    onClick={() => onEdit(item)}
                    aria-label={`Edit ${item.ticker} data`}
                >
                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/a4065550e60189e9315171cf0f5888bc6a869eb69f08c6fdf3b6bf9e0133403f?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078" alt="" className={styles.editIcon} />
                    <span>Edit</span>
                </button>
            </div>
            <hr className={styles.rowDivider} />
        </section>
    );
};