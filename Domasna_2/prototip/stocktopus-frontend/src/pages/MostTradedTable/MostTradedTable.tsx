import React from 'react';
import styles from './TableCard.module.css';
import { StockDetailsDTO } from "../../model/dto/stockDetailsDTO.ts";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

interface MostTradedTableProps {
    data: StockDetailsDTO[];
}

export const MostTradedTable: React.FC<MostTradedTableProps> = ({ data }) => {
    const parsePrice = (priceString: string): number => {
        // Remove potential currency symbols or whitespace and parse as a number
        return parseFloat(priceString.replace(/[^0-9.-]+/g, ""));
    };

    const getRowStyle = (percentageChange: string) => {
        const change = parsePrice(percentageChange);
        if (change > 0) return styles.positive;
        if (change < 0) return styles.negative;
        return styles.zero;
    };

    const getIndicator = (percentageChange: string) => {
        const change = parsePrice(percentageChange);
        if (change > 0) return <ArrowUpwardIcon className={styles.greenIcon} />;
        if (change < 0) return <ArrowDownwardIcon className={styles.redIcon} />;
        return <RadioButtonUncheckedIcon className={styles.blueIcon} />;
    };


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
                    <tr key={index} className={getRowStyle(row.percentageChange)}>
                        <td>
                            {getIndicator(row.percentageChange)} {row.stockName}
                        </td>
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
