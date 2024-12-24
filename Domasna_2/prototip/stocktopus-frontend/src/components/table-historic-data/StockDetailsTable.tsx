import React, { useEffect, useState } from 'react';
import { TableRow } from './TableRow';
import styles from '../../pages/AdminDashboard/AdminDashboard.module.css';
import { StockDetailsDTO } from '../../model/dto/stockDetailsDTO.ts';
import { StockDetailsEditDTO } from '../../model/dto/stockDetailsEditDTO.ts';
import { getItems, deleteStockDetails, editStockDetails } from '../../service/stockDetailsService.ts';
import { TablePagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import SuccessDialog from '../successDialog/SuccessDialog';
import Modal from '../modal/Modal.tsx';
import { useNavigate } from "react-router-dom";

interface StockDetailsTableProps {
    filterData: { stockName: string; dateFrom: string; dateTo: string };
}

export const StockDetailsTable: React.FC<StockDetailsTableProps> = ({ filterData }) => {
    const [items, setItems] = useState<StockDetailsDTO[]>([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(25);
    const [totalCount, setTotalCount] = useState(0);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const [selectedDetailsId, setSelectedDetailsId] = useState<number | null>(null);
    const navigate = useNavigate();

    const [isModalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState<StockDetailsEditDTO>({
        lastTransactionPrice: '',
        maxPrice: '',
        minPrice: '',
        averagePrice: '',
        percentageChange: '',
        quantity: '',
        tradeVolume: '',
        totalVolume: '',
    });

    useEffect(() => {
        loadItems();
    }, [page, size, filterData]);

    const loadItems = async () => {
        try {
            const response = await getItems({ page, size, ...filterData });
            setItems(response.content);
            setTotalCount(response.totalElements);
        } catch (error) {
            console.error("Error loading stock details:", error);
        }
    };

    const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSize(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteClick = (detailsId: number) => {
        setSelectedDetailsId(detailsId);
        setOpenDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (selectedDetailsId !== null) {
            try {
                await deleteStockDetails(selectedDetailsId);
                setOpenDeleteDialog(false);
                setOpenSuccessDialog(true);
                setSelectedDetailsId(null);
                loadItems();
            } catch (error) {
                console.error("Error deleting stock details:", error);
                setOpenErrorDialog(true);
            }
        }
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedDetailsId(null);
    };

    const handleCloseSuccessDialog = () => {
        setOpenSuccessDialog(false);
    };

    const handleCloseErrorDialog = () => {
        setOpenErrorDialog(false);
    };

    const handleSave = async () => {
        try {
            if (selectedDetailsId !== null) {
                await editStockDetails(selectedDetailsId, formData);
                loadItems();
                setModalOpen(false);
                setOpenSuccessDialog(true);
            }
        } catch (error) {
            console.error("Error editing stock details:", error);
            setOpenErrorDialog(true);
        }
    };

    return (
        <div>
            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <div className={styles.headerCell}>Stock Name</div>
                    <div className={styles.headerCell}>Date</div>
                    <div className={styles.headerCell}>Max Price</div>
                    <div className={styles.headerCell}>Min Price</div>
                    <div className={styles.headerCell}>Last Transaction Price</div>
                    <div className={styles.headerCell}>Actions</div>
                </div>
                {items.map((item) => (
                    <div key={`${item.detailsId}`} className={styles.tableRow}>
                        <span
                            className={styles.stockNameCell}
                            onClick={() => navigate(`/stock-details/${item.stockId}`)} // Navigate on stock name click
                            style={{ cursor: 'pointer' }}
                        >
                            {item.stockName}
                        </span>
                        <TableRow
                            item={item}
                            onEdit={() => {
                                setSelectedDetailsId(item.detailsId);
                                setFormData({
                                    lastTransactionPrice: item.lastTransactionPrice,
                                    maxPrice: item.maxPrice,
                                    minPrice: item.minPrice,
                                    averagePrice: item.averagePrice,
                                    percentageChange: item.percentageChange,
                                    quantity: item.quantity,
                                    tradeVolume: item.tradeVolume,
                                    totalVolume: item.totalVolume,
                                });
                                setModalOpen(true);
                            }}
                            onDelete={() => handleDeleteClick(item.detailsId)}
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

            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>{"Confirm Delete"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this stock detail?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
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

            <Dialog open={openErrorDialog} onClose={handleCloseErrorDialog}>
                <DialogTitle>{"Error"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        There was an error processing your request.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseErrorDialog}>Close</Button>
                </DialogActions>
            </Dialog>

            <Modal
                isOpen={isModalOpen}
                title="Edit Stock Details"
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
            >
                <form>
                    <div>
                        <label htmlFor="last_transaction_price">Last Transaction Price:</label>
                        <input
                            id="last_transaction_price"
                            type="text"
                            value={formData.lastTransactionPrice}
                            onChange={(e) => setFormData({ ...formData, lastTransactionPrice: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="max_price">Max Price:</label>
                        <input
                            id="max_price"
                            type="text"
                            value={formData.maxPrice}
                            onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="min_price">Min Price:</label>
                        <input
                            id="min_price"
                            type="text"
                            value={formData.minPrice}
                            onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="average_price">Average Price:</label>
                        <input
                            id="average_price"
                            type="text"
                            value={formData.averagePrice}
                            onChange={(e) => setFormData({ ...formData, averagePrice: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="percentage_change">Percentage Change:</label>
                        <input
                            id="percentage_change"
                            type="text"
                            value={formData.percentageChange}
                            onChange={(e) => setFormData({ ...formData, percentageChange: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="quantity">Quantity:</label>
                        <input
                            id="quantity"
                            type="text"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="trade_volume">Trade Volume:</label>
                        <input
                            id="trade_volume"
                            type="text"
                            value={formData.tradeVolume}
                            onChange={(e) => setFormData({ ...formData, tradeVolume: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="total_volume">Total Volume:</label>
                        <input
                            id="total_volume"
                            type="text"
                            value={formData.totalVolume}
                            onChange={(e) => setFormData({ ...formData, totalVolume: e.target.value })}
                        />
                    </div>
                </form>
            </Modal>
        </div>
    );
};
