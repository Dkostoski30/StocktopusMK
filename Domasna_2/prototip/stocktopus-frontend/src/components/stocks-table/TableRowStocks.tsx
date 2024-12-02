import React from 'react';
import {StockDTO} from "../../model/dto/stockDTO.ts";
import styles from '../../pages/AdminDashboard/AdminDashboard.module.css';

interface TableRowProps {
    item: StockDTO;
    onEdit: (item: StockDTO) => void;
    onDelete: (item: StockDTO) => void;
}

export const TableRowStocks: React.FC<TableRowProps> = ({ item, onEdit, onDelete }) => {
    return (
        <div className={styles.tableRow}>
            <div className={styles.tickerCell}>
                <span className={styles.tickerSymbol}>{item.stockId}</span>
            </div>
            <div className={styles.tickerCell}>
                <span className={styles.tickerSymbol}>{item.stockName}</span>
            </div>
        </div>
    );
};