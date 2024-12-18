import React from 'react';
import styles from './TableCard.module.css';
import {StockDetailsDTO} from "../../model/dto/stockDetailsDTO.ts";


interface MostTradedTableProps {
    data: StockDetailsDTO[];
}

export const MostTradedTable: React.FC<MostTradedTableProps> = ({ data }) => {
    return (
        <div className={styles.MostTradedTable}>
            <h2 className={styles.title}>Market Summary</h2>
            <table className={styles.stockTable}>
                <thead>
                <tr>
                    <th>Шифра</th>
                    <th>Просечна цена</th>
                    <th>% пром.</th>
                    <th>Промет во БЕСТ</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row, index) => (
                    <tr key={index}>
                        <td>{row.stockName}</td>
                        <td>{row.averagePrice}</td>
                        <td>{row.percentageChange}</td>
                        <td>{row.tradeVolume}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
