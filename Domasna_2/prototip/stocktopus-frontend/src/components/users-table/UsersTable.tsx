import React, { useState } from 'react';
import { TablePagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import styles from '../../pages/Users/Users.module.css';
import { deleteUser } from "../../service/userService.ts";
import SuccessDialog from '../successDialog/SuccessDialog';
import {UserDetailsDTO} from "../../model/dto/UserDetailsDTO.ts";

interface UsersTableProps {
    users: UserDetailsDTO[];
    totalCount: number;
   // onDelete: (username: string) => Promise<void>; // Callback for delete
}

export const UsersTable: React.FC<UsersTableProps> = ({ users,totalCount }) => {
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(25);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
    const [selectedUsername, setSelectedUsername] = useState<string | null>(null);

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
                await deleteUser(selectedUsername);
                setOpenDeleteDialog(false);
                setOpenSuccessDialog(true);
                setSelectedUsername(null);
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
                    <div className={styles.headerCell}>Role</div>
                    <div className={styles.headerCell}>Actions</div>
                </div>
                {users.map((user) => (
                    <div className={styles.tableRow} key={user.username}>
                        <div className={styles.rowCell}>{user.username}</div>
                        <div className={styles.rowCell}>{user.email}</div>
                        <div className={styles.rowCell}>{user.role}</div>
                        <div className={styles.rowCell} style={{display: "flex", justifyContent: "space-between"}}>
                            <button
                                className={styles.deleteButton}
                                onClick={() => onDelete(user)}
                                aria-label={`Delete ${user.username} data`}
                                style={{marginRight: "1rem"}}
                            >
                                Delete
                            </button>
                            {/*<button*/}
                            {/*    className={styles.editButton}*/}
                            {/*    onClick={() => onEdit(user)}*/}
                            {/*    aria-label={`Edit ${user.username} data`}*/}
                            {/*>*/}
                            {/*    <img*/}
                            {/*        src="https://cdn.builder.io/api/v1/image/assets/TEMP/a4065550e60189e9315171cf0f5888bc6a869eb69f08c6fdf3b6bf9e0133403f?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078"*/}
                            {/*        alt=""*/}
                            {/*        className={styles.editIcon}*/}
                            {/*    />*/}
                            {/*    <span>Edit</span>*/}
                            {/*</button>*/}
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
