import React, { useEffect, useState } from 'react';
import { TableRowStocks } from './TableRowStocks.tsx';
import styles from '../../pages/Stocks/Stocks.module.css';
import { StockDTO } from '../../model/dto/stockDTO.ts';
import { getItems, deleteItem, editItem } from "../../service/stockService.ts";
import SuccessDialog from '../successDialog/SuccessDialog';
import { TablePagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import Modal from "../modal/Modal.tsx";

export const StocksTable: React.FC = () => {
    const [items, setItems] = useState<StockDTO[]>([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(25);
    const [totalCount, setTotalCount] = useState(0);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const [selectedStockId, setSelectedStockId] = useState<number | null>(null);

    const [isModalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState<StockDTO>({
        stockId: -1,
        stockName: "",
    });

    const handleSave = async () => {
        try {
            if (formData.stockId !== -1) {
                await editItem(formData.stockId, formData);
                loadItems();
                setModalOpen(false);
                setOpenSuccessDialog(true);
            }
        } catch (error) {
            console.error("Error editing item:", error);
            setOpenErrorDialog(true);
        }
    };

    useEffect(() => {
        loadItems();
    }, [page, size]);

    const loadItems = async () => {
        try {
            const response = await getItems({ page, size });
            setItems(response.content);
            setTotalCount(response.totalElements);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
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

    const handleCloseErrorDialog = () => {
        setOpenErrorDialog(false);
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
                        onEdit={() => {
                            setFormData({
                                stockId: item.stockId,
                                stockName: item.stockName,
                            });
                            setModalOpen(true);
                        }}
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
                message="The operation was successful."
                onClose={handleCloseSuccessDialog}
            />

            <Dialog
                open={openErrorDialog}
                onClose={handleCloseErrorDialog}
                aria-labelledby="error-dialog-title"
                aria-describedby="error-dialog-description"
            >
                <DialogTitle id="error-dialog-title">{"Error"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="error-dialog-description">
                        There was an error processing your request.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseErrorDialog} color="primary">Close</Button>
                </DialogActions>
            </Dialog>

            <Modal
                isOpen={isModalOpen}
                title="Edit Item"
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
            >
                <form>
                    <div>
                        <label htmlFor="stock_id">Stock ID:</label>
                        <input
                            id="stock_id"
                            type="text"
                            value={formData.stockId}
                            disabled
                        />
                    </div>
                    <div>
                        <label htmlFor="stock_name">Stock Name:</label>
                        <textarea
                            id="stock_name"
                            value={formData.stockName}
                            onChange={(e) => setFormData({ ...formData, stockName: e.target.value })}
                        />
                    </div>
                </form>
            </Modal>
        </div>
    );
};