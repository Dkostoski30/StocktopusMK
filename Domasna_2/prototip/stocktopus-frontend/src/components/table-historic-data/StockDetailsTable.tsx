import React, { useEffect, useState } from 'react';
import { TableRow } from './TableRow';
import styles from '../../pages/AdminDashboard/AdminDashboard.module.css';
import { StockDetailsDTO } from '../../model/dto/stockDetailsDTO.ts';
import { getItems, deleteStockDetails } from '../../service/stockDetailsService.ts';
import { TablePagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import SuccessDialog from '../successDialog/SuccessDialog'; // Import SuccessDialog

export const StockDetailsTable: React.FC = () => {
    const [items, setItems] = useState<StockDetailsDTO[]>([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(25);
    const [totalCount, setTotalCount] = useState(0);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State for delete confirmation dialog
    const [openSuccessDialog, setOpenSuccessDialog] = useState(false); // State for success dialog
    const [selectedDetailsId, setSelectedDetailsId] = useState<number | null>(null);

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

    const handleDeleteClick = (detailsId: number) => {
        setSelectedDetailsId(detailsId);
        setOpenDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (selectedDetailsId !== null) {
            await deleteStockDetails(selectedDetailsId);
            setOpenDeleteDialog(false);
            setOpenSuccessDialog(true); // Show success dialog
            setSelectedDetailsId(null);
            loadItems();
        }
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedDetailsId(null);
    };

    const handleCloseSuccessDialog = () => {
        setOpenSuccessDialog(false);
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
                    <TableRow
                        key={`${item.detailsId}`}
                        item={item}
                        onEdit={() => {}} // Add edit logic if needed
                        onDelete={() => handleDeleteClick(item.detailsId)}
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

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">{"Confirm Delete"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete this stock detail?
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
                message="The stock detail has been successfully deleted."
                onClose={handleCloseSuccessDialog}
            />
        </div>
    );
};
