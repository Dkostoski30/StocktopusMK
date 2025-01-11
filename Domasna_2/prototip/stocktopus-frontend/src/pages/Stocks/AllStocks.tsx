import React, { useEffect, useState } from 'react';
import styles from '../HistoricData/HistoricData.module.css';
import { FilterFormStocks } from '../../components/FilterForm/FilterFormStocks';
import Navigation from "../../components/navigation/Navigation.tsx";
import logo from "../../assets/logo.png";
import { Footer } from "../../components/footer/Footer.tsx";
import { UserProfile } from "../../components/userProfile/UserProfile.tsx";
import { isAdmin } from "../../config/jwtToken.ts";
import { ICONS } from "../../config/icons.ts";
import { StockDTO } from '../../model/dto/stockDTO.ts';
import ReusableTable from '../../components/table/Table.tsx';
import SuccessOrErrorDialog from '../../components/successOrErrorDialog/SuccessOrErrorDialog.tsx';
import { findAll, deleteStock, editStock } from "../../service/stockService.ts";
import Modal from "../../components/modal/Modal.tsx";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import {LoadingScreen} from "../../components/loadingScreen/loadingScreen.tsx";

interface SidebarItem {
    icon: string;
    label: string;
    path: string;
    isActive: boolean;
}

const sidebarItemsAdmin: SidebarItem[] = [
    { icon: ICONS.historicData, label: 'Historic data', path: '/admin/historic-data', isActive: false },
    { icon: ICONS.stocks, label: 'Stocks', path: '/admin/stocks', isActive: true },
    { icon: ICONS.users, label: 'Users', path: '/admin/users', isActive: false },
    { icon: ICONS.backToHome, label: 'Back to Home Page', path: '/', isActive: false },
];

const sidebarItemsUser: SidebarItem[] = [
    { icon: ICONS.historicData, label: 'Historic data', path: '/user/historic-data', isActive: false },
    { icon: ICONS.stocks, label: 'Stocks', path: '/user/stocks', isActive: true },
    { icon: ICONS.backToHome, label: 'Back to Home Page', path: '/', isActive: false },
];

export const AllStocks: React.FC = () => {
    const [filterData, setFilterData] = useState({ stockName: '' });
    const [items, setItems] = useState<StockDTO[]>([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(25);
    const [totalCount, setTotalCount] = useState(0);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogType, setDialogType] = useState<'success' | 'error'>('success');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const columns = [
        { label: 'Stock ID', key: 'stockId', sortable: true },
        { label: 'Company Name', key: 'fullName', sortable: true },
        { label: 'Stock Name', key: 'stockName', sortable: true },
        ...(isAdmin() ? [{ label: 'Actions', key: 'actions', sortable: false }] : [])
    ];

    useEffect(() => {
        loadItems();
    }, [page, size, filterData]);

    const loadItems = async () => {
        setIsLoading(true);
        try {
            const response = await findAll({ page, size, ...filterData });
            setItems(response.content);
            setTotalCount(response.totalElements);
        } catch (error) {
            console.error("Error loading stocks:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilter = (data: { stockName: string }) => {
        setFilterData(data);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteStock(selectedStock.stockId);
            setDialogMessage('The stock was successfully deleted.');
            setDialogType('success');
            loadItems();
        } catch {
            setDialogMessage('There was an error deleting the stock.');
            setDialogType('error');
        } finally {
            setDeleteDialogOpen(false);
        }
    };

    const handleEditConfirm = async () => {
        try {
            await editStock(selectedStock.stockId, selectedStock);
            await loadItems();
            setDialogMessage('The stock was successfully updated.');
            setDialogType('success');
        } catch {
            setDialogMessage('There was an error updating the stock.');
            setDialogType('error');
        } finally {
            setEditModalOpen(false);
        }
    };

    const renderRow = (item: any) => (
        <>
            <td>{item.stockId}</td>
            <td>
                <a href={`/stock-details/${item.stockId}`} className={styles.customLink }>
                    {item.fullName}
                </a>
            </td>
            <td>
                <a href={`/stock-details/${item.stockId}`} className={styles.customLink }>
                    {item.stockName}
                </a>
            </td>
            {isAdmin() && (
                <td>
                    <div className={styles.actionCell}>
                        <button
                            className={styles.deleteButton}
                            onClick={() => {
                                setSelectedStock(item);
                                setDeleteDialogOpen(true);
                            }}
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => {
                                setSelectedStock(item);
                                setEditModalOpen(true);
                            }}
                            className={styles.editButton}
                            aria-label={`Edit ${item.stockId} data`}
                        >
                            <img
                                src={ICONS.edit}
                                alt=""
                                className={styles.editIcon}
                            />
                            <span>Edit</span>
                        </button>
                    </div>
                </td>
            )}
        </>
    );

    return (
        <main className={styles.dashboardDesign}>
            <div className={styles.layout}>
                <nav className={styles.sidebar}>
                    <div className={styles.logo}>
                        <img src={logo} alt="Stocktopus logo" className={styles.logoImage} />
                        <h1 className={styles.logoText}>Stocktopus</h1>
                    </div>
                    <Navigation items={isAdmin() ? sidebarItemsAdmin : sidebarItemsUser} />
                </nav>
                <section className={styles.content}>
                    <header className={styles.contentHeader}>
                        <h2 className={styles.pageTitle}>Stocks</h2>
                        <UserProfile />
                    </header>
                    <FilterFormStocks onSubmit={handleFilter} />
                    <div className={styles.tableContainer}>
                        <ReusableTable
                            columns={columns}
                            data={items}
                            page={page}
                            size={size}
                            totalCount={totalCount}
                            onPageChange={setPage}
                            onRowsPerPageChange={setSize}
                            renderRow={renderRow}
                        />
                        {isLoading && <LoadingScreen />}
                    </div>
                </section>
            </div>
            <Footer />
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
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
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="secondary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Modal
                isOpen={editModalOpen}
                title="Edit Stock"
                onClose={() => setEditModalOpen(false)}
                onSave={handleEditConfirm}
            >
                <form>
                    <div>
                        <label htmlFor="stock_id">Stock ID:</label>
                        <input
                            id="stock_id"
                            type="text"
                            value={selectedStock?.stockId || ''}
                            disabled
                        />
                    </div>
                    <div>
                        <label htmlFor="stock_name">Stock Name:</label>
                        <input
                            id="stock_name"
                            type="text"
                            value={selectedStock?.stockName || ''}
                            onChange={(e) => setSelectedStock({ ...selectedStock, stockName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="company_name">Company Name:</label>
                        <input
                            id="company_name"
                            type="text"
                            value={selectedStock?.fullName || ''}
                            onChange={(e) => setSelectedStock({ ...selectedStock, fullName: e.target.value })}
                        />
                    </div>
                </form>
            </Modal>
            <SuccessOrErrorDialog
                open={!!dialogMessage}
                message={dialogMessage}
                onClose={() => setDialogMessage('')}
                type={dialogType}
            />
        </main>
    );
};