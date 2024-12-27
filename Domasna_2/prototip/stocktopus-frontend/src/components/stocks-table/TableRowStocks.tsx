import React from 'react';
import {StockDTO} from "../../model/dto/stockDTO.ts";
import styles from '../../pages/HistoricData/HistoricData.module.css';
import { useNavigate } from 'react-router-dom';
import {isAdmin} from "../../config/jwtToken.ts";



interface TableRowProps {
    item: StockDTO;
    onEdit: (item: StockDTO) => void;
    onDelete: (item: StockDTO) => void;
}

export const TableRowStocks: React.FC<TableRowProps> = ({ item, onEdit, onDelete }) => {
    const navigate = useNavigate();
    return (
        <div className={styles.tableRow}>
            <div className={styles.tickerCell}>
                <span className={styles.tickerSymbol}>{item.stockId}</span>
            </div>
            <div className={styles.fullName}
                 key={item.stockId}
                 onClick={() => navigate(`/stock-details/${item.stockId}`)}
                 style={{ cursor: 'pointer' }}>
                <span className={styles.tickerSymbol}>{item.fullName}</span>
            </div>
            <div className={styles.tickerCell}
                 key={item.stockId}
                 onClick={() => navigate(`/stock-details/${item.stockId}`)}
                 style={{ cursor: 'pointer' }}>
                <span className={styles.tickerSymbol}>{item.stockName}</span>
            </div>
            {isAdmin() ? (
            <div className={styles.actionCell}>
                <button
                    className={styles.deleteButton}
                    onClick={() => onDelete(item)}
                    aria-label={`Delete ${item.stockId} data`}
                >
                    Delete
                </button>
                <button
                    className={styles.editButton}
                    onClick={() => onEdit(item)}
                    aria-label={`Edit ${item.stockId} data`}
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