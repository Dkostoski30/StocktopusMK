import React, { useEffect, useState } from 'react';
import { TableRowStocks } from './TableRowStocks.tsx';
import styles from '../../../pages/Stocks/Stocks.module.css';
import { StockDTO } from '../../../model/dto/stockDTO.ts';
import { findAll, deleteStock, editStock } from "../../../service/stockService.ts";
import SuccessOrErrorDialog from '../../successOrErrorDialog/SuccessOrErrorDialog.tsx';
import { TablePagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import Modal from "../../modal/Modal.tsx";
import { isAdmin } from "../../../config/jwtToken.ts";

interface StocksTableProps {
    filterData: { stockName: string };
}

export const StocksTable: React.FC<StocksTableProps> = ({ filterData }) => {
    const [items, setItems] = useState<StockDTO[]>([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(25);
    const [totalCount, setTotalCount] = useState(0);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogType, setDialogType] = useState<'success' | 'error'>('success');
    const [selectedStockId, setSelectedStockId] = useState<number | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState<StockDTO>({
        stockId: -1,
        stockName: "",
        fullName: "",
    });

    const handleSave = async () => {
        try {
            if (formData.stockId !== -1) {
                await editStock(formData.stockId, formData);
                loadItems();
                setModalOpen(false);
                setDialogMessage('The operation was successful.');
                setDialogType('success');
            }
        } catch{
            setDialogMessage('There was an error processing your request.');
            setDialogType('error');
        }
    };

    useEffect(() => {
        loadItems();
    }, [page, size, filterData]);

    const loadItems = async () => {
        try {
            const response = await findAll({ page, size, ...filterData });
            setItems(response.content);
            setTotalCount(response.totalElements);
        } catch (error) {
            console.error("Error loading stocks:", error);
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
                await deleteStock(selectedStockId);
                setOpenDeleteDialog(false);
                setDialogMessage('The operation was successful.');
                setDialogType('success');
                setSelectedStockId(null);
                loadItems();
            } catch {
                setDialogMessage('There was an error processing your request.');
                setDialogType('error');
                setOpenDeleteDialog(false);
            }
        }
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedStockId(null);
    };

    const handleCloseDialog = () => {
        setDialogMessage('');
    };

    return (
        <div>
            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <div className={styles.headerCell}>Stock ID</div>
                    <div className={styles.headerCell}>Company name</div>
                    <div className={styles.headerCell}>Stock Name</div>
                    {isAdmin() ? (<div className={styles.headerCell} style={{ marginLeft: '155px' }}>Actions</div>) : null}
                </div>
                {items.map((item) => (
                    <div key={item.stockId}>
                        <TableRowStocks
                            item={item}
                            onEdit={() => {
                                setFormData({
                                    stockId: item.stockId,
                                    stockName: item.stockName,
                                    fullName: item.fullName,
                                });
                                setModalOpen(true);
                            }}
                            onDelete={() => handleDeleteClick(item.stockId)}
                        />
                    </div>
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

            <SuccessOrErrorDialog
                open={!!dialogMessage}
                message={dialogMessage}
                onClose={handleCloseDialog}
                type={dialogType}
            />

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