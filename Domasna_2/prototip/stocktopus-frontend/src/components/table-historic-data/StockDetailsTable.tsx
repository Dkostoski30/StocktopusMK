import React, {useEffect, useState} from 'react';
import { TableRow } from './TableRow';
import styles from '../../pages/AdminDashboard/AdminDashboard.module.css';
import { StockDetailsDTO } from '../../model/dto/stockDetailsDTO.ts';
import {getItems} from "../../service/stockDetailsService.ts";
import {TablePagination} from "@mui/material";

/*interface TableProps {
    data: StockDetailsDTO[];
    handleEdit: (item: StockDetailsDTO) => void;
    handleDelete: (item: StockDetailsDTO) => void;
}*/

// eslint-disable-next-line no-empty-pattern
export const StockDetailsTable: React.FC = ({  }) => {

    const [items, setItems] = useState<StockDetailsDTO[]>([]);
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
                    <div className={styles.headerCell}>Stock Name</div>
                    <div className={styles.headerCell}>Max Price</div>
                    <div className={styles.headerCell}>Min Price</div>
                    <div className={styles.headerCell}>Last Transaction Price</div>
                    <div className={styles.headerCell}>Actions</div>
                </div>
                {items.map((item) => (
                    <TableRow
                        key={`${item.detailsId}`}
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
