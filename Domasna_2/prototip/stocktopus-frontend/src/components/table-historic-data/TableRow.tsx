import React from 'react';
import styles from '../../pages/HistoricData/HistoricData.module.css';
import { StockDetailsDTO } from "../../model/dto/stockDetailsDTO.ts";
import { useNavigate } from 'react-router-dom';
import {isAdmin} from "../../config/jwtToken.ts";

interface TableRowProps {
    item: StockDetailsDTO;
    onEdit: (item: StockDetailsDTO) => void;
    onDelete: (item: StockDetailsDTO) => void;
}

export const TableRow: React.FC<TableRowProps> = ({ item, onEdit, onDelete }) => {
    const navigate = useNavigate();
    const formatDate = (date: Date): string => {
        const parsedDate = new Date(date);
        const day = parsedDate.getDate().toString().padStart(2, '0');
        const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
        const year = parsedDate.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const formatValue = (value: string ): string => {
        return value !== null && value !== undefined && value !== "" ? value : '0,00';
    };

    return (
        <div className={styles.tableRow}>
            <div className={styles.tickerCell}
                 key={item.stockId}
                 onClick={() => navigate(`/stock-details/${item.stockId}`)}
                 style={{ cursor: 'pointer' }}>
                <span className={styles.tickerSymbol}>{item.stockName}</span>
            </div>
            <div className={styles.tickerCell}>
                <span className={styles.dataCell}>{formatDate(item.date)}</span>
            </div>
            <div className={styles.dataCell}>
                <span>{formatValue(item.maxPrice)}</span>
            </div>
            <div className={styles.priceCell}>
                <span>{formatValue(item.minPrice)}</span>
            </div>
            <div className={styles.dataCell}>
                <span className={styles.lastPrice}>{formatValue(item.lastTransactionPrice)}</span>
            </div>
            {isAdmin() ? (
            <div className={styles.actionCell}>

            <button
                    className={styles.deleteButton}
                    onClick={() => onDelete(item)}
                    aria-label={`Delete ${item.detailsId} data`}
                >
                    Delete
                </button>
                <button
                    className={styles.editButton}
                    onClick={() => onEdit(item)}
                    aria-label={`Edit ${item.detailsId} data`}
                >
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/a4065550e60189e9315171cf0f5888bc6a869eb69f08c6fdf3b6bf9e0133403f?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078"
                        alt=""
                        className={styles.editIcon}
                    />
                    <span>Edit</span>
                </button>
            </div>
                ) : null}
        </div>
    );
};
