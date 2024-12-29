import React, { useEffect, useState } from 'react';
import { TablePagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import styles from '../../pages/Users/Users.module.css';
import { UserDTO } from '../../model/dto/UserDTO.ts';
import { getUsers, deleteUser } from "../../service/userService.ts";
import SuccessDialog from '../successDialog/SuccessDialog';
import Modal from "../modal/Modal.tsx";

interface UsersTableProps {
    filterData: { username: string };
}

export const UsersTable: React.FC<UsersTableProps> = ({ filterData }) => {
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(25);
    const [totalCount, setTotalCount] = useState(0);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
    const [selectedUsername, setSelectedUsername] = useState<string | null>(null);

    useEffect(() => {
        loadUsers();
    }, [page, size, filterData]);

    const loadUsers = async () => {
        try {
            const response = await getUsers({ page, size, ...filterData });
            setUsers(response.content);
            setTotalCount(response.totalElements);
        } catch (error) {
            console.error("Error loading users:", error);
        }
    };

    const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSize(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteClick = (username: string) => {
        setSelectedUsername(username);
        setOpenDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (selectedUsername) {
            try {
                await deleteUser(selectedUsername); // Pass username to deleteUser function
                setOpenDeleteDialog(false);
                setOpenSuccessDialog(true);
                setSelectedUsername(null);
                loadUsers();
            } catch (error) {
                console.error('Error during delete:', error);
                setOpenDeleteDialog(false);
            }
        }
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedUsername(null);
    };

    const handleCloseSuccessDialog = () => {
        setOpenSuccessDialog(false);
    };

    return (
        <div>
            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <div className={styles.headerCell}>Username</div>
                    <div className={styles.headerCell}>Email</div>
                </div>
                {users.map((user) => (
                    <div className={styles.tableRow} key={user.username}>
                        <div className={styles.rowCell}>{user.username}</div>
                        <div className={styles.rowCell}>{user.email}</div>
                        <div className={styles.rowCell}>
                            <Button onClick={() => handleDeleteClick(user.username)} color="secondary">
                                Delete
                            </Button>
                        </div>
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
                        Are you sure you want to delete this user?
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
                message="The user was successfully deleted."
                onClose={handleCloseSuccessDialog}
            />
        </div>
    );
};
