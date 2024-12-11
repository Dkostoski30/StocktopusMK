import React, { useEffect, useState } from 'react';
import { TableRowStocks } from './TableRowStocks.tsx';
import styles from '../../pages/Stocks/Stocks.module.css';
import { StockDTO } from '../../model/dto/stockDTO.ts';
import { getItems,deleteItem } from "../../service/stockService.ts";
import SuccessDialog from '../successDialog/SuccessDialog'; // Import SuccessDialog
import { TablePagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

export const StocksTable: React.FC = () => {
    const [items, setItems] = useState<StockDTO[]>([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(25);
    const [totalCount, setTotalCount] = useState(0);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State for delete confirmation dialog
    const [openSuccessDialog, setOpenSuccessDialog] = useState(false); // State for success dialog
    const [selectedStockId, setSelectedStockId] = useState<number | null>(null);

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
        setOpenDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (selectedStockId !== null) {
            try {
                await deleteItem(selectedStockId);
                setOpenDeleteDialog(false);
                setOpenSuccessDialog(true); // Show success dialog
                setSelectedStockId(null);
                loadItems();
            } catch (error) {
                console.error('Error during delete:', error);
                setOpenDeleteDialog(false);
            }
        }
    };



    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedStockId(null);
    };

    const handleCloseSuccessDialog = () => {
        setOpenSuccessDialog(false);
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
                        onEdit={() => {}} // Add edit logic if needed
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

            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">{"Confirm Delete"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete this stock?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">Cancel</Button>
                    <Button onClick={confirmDelete} color="secondary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <SuccessDialog
                open={openSuccessDialog}
                message="The stock has been successfully deleted."
                onClose={handleCloseSuccessDialog}
            />
        </div>
    );
};
