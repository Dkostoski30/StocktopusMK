import React from 'react';
import styles from '../../pages/AdminDashboard/HistoricData.module.css';
import {StockDetailsDTO} from "../../model/dto/stockDetailsDTO.ts";

interface TableRowProps {
    item: StockDetailsDTO;
    onEdit: (item: StockDetailsDTO) => void;
    onDelete: (item: StockDetailsDTO) => void;
}

export const TableRow: React.FC<TableRowProps> = ({ item, onEdit, onDelete }) => {
    return (
        <div className={styles.tableRow}>
            <div className={styles.tickerCell}>
                <span className={styles.tickerSymbol}>{item.stockName}</span>
            </div>
            <div className={styles.dataCell}>
                <span>{item.maxPrice}</span>
            </div>
            <div className={styles.priceCell}>
                <span>{item.minPrice}</span>
            </div>
            <div className={styles.actionCell}>
                <span className={styles.lastPrice}>{item.lastTransactionPrice}</span>
                <button
                    className={styles.deleteButton}
                    onClick={() => onDelete(item)}
                    aria-label={`Delete ${item.stockName} data`}
                >
                    Delete
                </button>
                <button
                    className={styles.editButton}
                    onClick={() => onEdit(item)}
                    aria-label={`Edit ${item.stockName} data`}
                >
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/a4065550e60189e9315171cf0f5888bc6a869eb69f08c6fdf3b6bf9e0133403f?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078"
                        alt=""
                        className={styles.editIcon}
                    />
                    <span>Edit</span>
                </button>
            </div>
        </div>
    );
};