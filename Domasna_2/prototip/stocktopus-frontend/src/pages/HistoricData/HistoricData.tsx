import React, { useEffect, useState } from 'react';
import styles from './HistoricData.module.css';
import { FilterForm } from '../../components/FilterForm/FilterForm.tsx';
import Navigation from "../../components/navigation/Navigation.tsx";
import logo from "../../assets/logo.png";
import { Footer } from "../../components/footer/Footer.tsx";
import { UserProfile } from "../../components/userProfile/UserProfile.tsx";
import { isAdmin } from "../../config/jwtToken.ts";
import { ICONS } from "../../config/icons.ts";
import Modal from "../../components/modal/Modal.tsx";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { StockDetailsEditDTO } from "../../model/dto/stockDetailsEditDTO.ts";
import SuccessOrErrorDialog from "../../components/successOrErrorDialog/SuccessOrErrorDialog.tsx";
import { deleteStockDetails, editStockDetails, findAll } from "../../service/stockDetailsService.ts";
import { StockDetailsDTO } from "../../model/dto/stockDetailsDTO.ts";
import ReusableTable from "../../components/table/Table.tsx";
import {LoadingScreen} from "../../components/loadingScreen/loadingScreen.tsx";

interface SidebarItem {
    icon: string;
    label: string;
    path: string;
    isActive: boolean;
}

const sidebarItemsAdmin: SidebarItem[] = [
    { icon: ICONS.historicData, label: 'Historic data', path: '/admin/historic-data', isActive: true },
    { icon: ICONS.stocks, label: 'Stocks', path: '/admin/stocks', isActive: false },
    { icon: ICONS.users, label: 'Users', path: '/admin/users', isActive: false },
    { icon: ICONS.backToHome, label: 'Back to Home Page', path: '/', isActive: false },
];

const sidebarItemsUser: SidebarItem[] = [
    { icon: ICONS.historicData, label: 'Historic data', path: '/user/historic-data', isActive: true },
    { icon: ICONS.stocks, label: 'Stocks', path: '/user/stocks', isActive: false },
    { icon: ICONS.backToHome, label: 'Back to Home Page', path: '/', isActive: false },
];



export const HistoricData: React.FC = () => {
    const [filterData, setFilterData] = useState({ stockName: '', dateFrom: '', dateTo: '' });
    const [items, setItems] = useState<StockDetailsDTO[]>([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(25);
    const [totalCount, setTotalCount] = useState(0);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogType, setDialogType] = useState<'success' | 'error'>('success');
    const [selectedDetailsId, setSelectedDetailsId] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<string | undefined>(undefined);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
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
    const columns = [
        { label: 'Stock Name', key: 'stockName', sortable: true },
        { label: 'Date', key: 'date', sortable: true },
        { label: 'Max Price', key: 'maxPrice', sortable: true },
        { label: 'Min Price', key: 'minPrice', sortable: true },
        { label: 'Last Transaction Price', key: 'lastTransactionPrice', sortable: true },
        ...(isAdmin() ? [{ label: 'Actions', key: 'actions', sortable: false }] : [])
    ];
    const handleFilter = (data: { stockName: string; dateFrom: string; dateTo: string }) => {
        setFilterData(data);
    };

    useEffect(() => {
        loadItems();
    }, [page, size, filterData, sortBy, sortOrder]);

    const loadItems = async () => {
        setIsLoading(true); // Set loading to true before fetching data
        const response = await findAll({ page, size, ...filterData, sortBy, sortOrder });
        setItems(response.content);
        setTotalCount(response.totalElements);
        setIsLoading(false); // Set loading to false after data is fetched
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
                setDialogMessage('The operation was successful.');
                setDialogType('success');
                setSelectedDetailsId(null);
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
        setSelectedDetailsId(null);
    };

    const handleCloseDialog = () => {
        setDialogMessage('');
    };

    const handleSave = async () => {
        try {
            if (selectedDetailsId !== null) {
                await editStockDetails(selectedDetailsId, formData);
                loadItems();
                setModalOpen(false);
                setDialogMessage('The operation was successful.');
                setDialogType('success');
            }
        } catch {
            setDialogMessage('There was an error processing your request.');
            setDialogType('error');
        }
    };

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const renderRow = (item: any) => (
        <>
            <td>
                <a href={`/stock-details/${item.stockId}`} className={styles.customLink }>
                    {item.stockName}
                </a>
            </td>
            <td>{item.date}</td>
            <td>{item.maxPrice !== null && item.maxPrice !== '' ? item.maxPrice : '0,00'}</td>
            <td>{item.minPrice !== null && item.minPrice !== '' ? item.minPrice : '0,00'}</td>
            <td>{item.lastTransactionPrice !== null && item.lastTransactionPrice !== '' ? item.lastTransactionPrice : '0,00'}</td>
            {isAdmin() && (
                <td>
                    <div className={styles.actionCell}>
                        <button
                            className={styles.deleteButton}
                            onClick={() => handleDeleteClick(item.detailsId)}
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => {
                                setSelectedDetailsId(item.detailsId);
                                setFormData({
                                    lastTransactionPrice: item.lastTransactionPrice !== '' ? item.lastTransactionPrice : '0,00',
                                    maxPrice: item.maxPrice !== '' ? item.maxPrice : '0,00',
                                    minPrice: item.minPrice !== '' ? item.minPrice : '0,00',
                                    averagePrice: item.averagePrice !== '' ? item.averagePrice : '0,00',
                                    percentageChange: item.percentageChange !== '' ? item.percentageChange : '0,00',
                                    quantity: item.quantity !== '' ? item.quantity : '0,00',
                                    tradeVolume: item.tradeVolume !== '' ? item.tradeVolume : '0,00',
                                    totalVolume: item.totalVolume !== '' ? item.totalVolume : '0,00',
                                });
                                setModalOpen(true);
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
                        <h2 className={styles.pageTitle}>Historic data</h2>
                        <UserProfile />
                    </header>
                    <FilterForm onSubmit={handleFilter} />
                    <div className={styles.tableContainer}>
                        <ReusableTable
                            columns={columns}
                            data={items}
                            page={page}
                            size={size}
                            totalCount={totalCount}
                            onPageChange={setPage}
                            onRowsPerPageChange={setSize}
                            onSort={handleSort}
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            renderRow={renderRow}
                        />
                        {isLoading && <LoadingScreen />}
                    </div>
                </section>
            </div>
            <Footer />
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
            <SuccessOrErrorDialog
                open={!!dialogMessage}
                message={dialogMessage}
                onClose={handleCloseDialog}
                type={dialogType}
            />
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
        </main>
    );
};