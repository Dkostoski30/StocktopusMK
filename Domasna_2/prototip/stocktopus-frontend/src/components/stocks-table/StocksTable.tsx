import React, { useEffect, useState } from 'react';
import { TableRowStocks } from './TableRowStocks.tsx';
import styles from '../../pages/Stocks/Stocks.module.css';
import { StockDTO } from '../../model/dto/stockDTO.ts';
import { getItems, deleteItem } from '../../service/stockService.ts'; // Add deleteItem to your service
import { TablePagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

export const StocksTable: React.FC = () => {
    const [items, setItems] = useState<StockDTO[]>([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(25);
    const [totalCount, setTotalCount] = useState(0);
    const [open, setOpen] = useState(false); // State to control popup visibility
    const [selectedStockId, setSelectedStockId] = useState<number | null>(null); // Store the stockId to be deleted

    useEffect(() => {
        loadItems();
    }, [page, size]);

    const loadItems = async () => {
        const response = await getItems({ page, size });
        setItems(response.content);
        setTotalCount(response.totalElements);
    };

    const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSize(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteClick = (stockId: number) => {
        setSelectedStockId(stockId);
        setOpen(true); // Show the confirmation popup
    };

    const confirmDelete = async () => {
        if (selectedStockId !== null) {
            await deleteItem(selectedStockId); // Call the delete API
            setOpen(false);
            setSelectedStockId(null);
            loadItems(); // Refresh the table
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedStockId(null);
    };

    return (
        <div>
            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <div className={styles.headerCell}>Stock ID</div>
                    <div className={styles.headerCell}>Stock Name</div>
                    <div className={styles.headerCell} style={{ marginLeft: '155px' }}>Actions</div>
                </div>
                {items.map((item) => (
                    <TableRowStocks
                        key={`${item.stockId}`}
                        item={item}
                        onEdit={() => {}}
                        onDelete={() => handleDeleteClick(item.stockId)}
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

            {/* Confirmation Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this stock?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button onClick={confirmDelete} color="secondary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
