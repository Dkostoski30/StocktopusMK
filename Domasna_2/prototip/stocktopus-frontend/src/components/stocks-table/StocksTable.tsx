import React, { useEffect, useState } from 'react';
import { TableRowStocks } from './TableRowStocks.tsx';
import styles from '../../pages/Stocks/Stocks.module.css';
import { StockDTO } from '../../model/dto/stockDTO.ts';
import { getItems, deleteItem, editItem } from "../../service/stockService.ts";
import SuccessDialog from '../successDialog/SuccessDialog';
import { TablePagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import Modal from "../modal/Modal.tsx";
import { isAdmin } from "../../config/jwtToken.ts";

interface StocksTableProps {
    filterData: { stockName: string };
}

export const StocksTable: React.FC<StocksTableProps> = ({ filterData }) => {
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
        fullName: "",
    });

    const [favorites, setFavorites] = useState<string[]>([]);

    const toggleFavorite = (stockId: string) => {
        setFavorites(prevFavorites =>
            prevFavorites.includes(stockId)
                ? prevFavorites.filter(fav => fav !== stockId)
                : [...prevFavorites, stockId]
        );
    };

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
    }, [page, size, filterData]);

    const loadItems = async () => {
        try {
            const response = await getItems({ page, size, ...filterData });
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
                    <div className={styles.headerCell}>Company name</div>
                    <div className={styles.headerCell}>Stock Name</div>
                    {isAdmin() ? (<div className={styles.headerCell} style={{ marginLeft: '155px' }}>Actions</div>) : null}
                    <div className={styles.headerCell}></div>
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
                            favorites={favorites}
                            toggleFavorite={toggleFavorite}
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
                        Are you sure you want to delete this stock data?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">Cancel</Button>
                    <Button onClick={confirmDelete} color="primary" autoFocus>Delete</Button>
                </DialogActions>
            </Dialog>
            <SuccessDialog
                open={openSuccessDialog}
                onClose={handleCloseSuccessDialog}
                message="Stock data updated successfully."
            />
            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
                formData={formData}
                setFormData={setFormData}
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
                        An error occurred while updating stock data. Please try again later.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseErrorDialog} color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
