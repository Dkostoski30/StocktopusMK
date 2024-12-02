import React, {useEffect, useState} from 'react';
import { TableRowStocks } from './TableRowStocks.tsx';
import styles from '../../pages/Stocks/Stocks.module.css';
import { StockDTO } from '../../model/dto/stockDTO.ts';
import {getItems} from "../../service/stockService.ts";
import {TablePagination} from "@mui/material";

/*interface TableProps {
    data: StockDetailsDTO[];
    handleEdit: (item: StockDetailsDTO) => void;
    handleDelete: (item: StockDetailsDTO) => void;
}*/

// eslint-disable-next-line no-empty-pattern
export const StocksTable: React.FC = ({  }) => {

    const [items, setItems] = useState<StockDTO[]>([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(25);
    const [totalCount, setTotalCount] = useState(0);
    function handleChangePage(_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) {
        setPage(newPage);
    }

    function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
        setSize(parseInt(event.target.value, 10));
        setPage(0);
    }

    useEffect(() => {
        loadItems();
        console.log(items)
    }, [page, size]);

    const loadItems = async () => {
        const response = await getItems({ page, size });
        setItems(response.content);
        setTotalCount(response.totalElements)
    };
    const handleEdit = () => {
        // Handle edit logic
    };

    const handleDelete = () => {
        // Handle delete logic
    };
    return (
        <div>
            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <div className={styles.headerCell}>Stock ID</div>
                    <div className={styles.headerCell}>Stock Name</div>
                    <div className={styles.headerCell} style={{marginLeft: '155px'}}>Actions</div>
                </div>
                {items.map((item) => (
                    <TableRowStocks
                        key={`${item.stockId}`}
                        item={item}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
            <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={size}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
};
