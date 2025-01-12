import React, { useState, useEffect } from 'react';
import styles from './Users.module.css';
import Navigation from "../../components/navigation/Navigation";
import logo from "../../assets/logo.png";
import { Footer } from "../../components/footer/Footer";
import { UserProfile } from "../../components/userProfile/UserProfile.tsx";
import { fetchAllUsers, deleteUser } from "../../service/userService.ts";
import { UserDetailsDTO } from "../../model/dto/UserDetailsDTO.ts";
import { Autocomplete, TextField } from '@mui/material';
import ReusableTable from "../../components/table/Table.tsx";
import TableCell from '@mui/material/TableCell';
import { ICONS } from "../../config/icons.ts";
import { LoadingScreen } from "../../components/loadingScreen/loadingScreen.tsx";

interface SidebarItem {
    icon: string;
    label: string;
    path: string;
    isActive: boolean;
}

const sidebarItems: SidebarItem[] = [
    { icon: ICONS.historicData, label: 'Historic data', path: '/admin/historic-data', isActive: false },
    { icon: ICONS.stocks, label: 'Stocks', path: '/admin/stocks', isActive: false },
    { icon: ICONS.users, label: 'Users', path: '/admin/users', isActive: true },
    { icon: ICONS.backToHome, label: 'Back to Home Page', path: '/', isActive: false }
];

const roleOptions = [
    { label: 'User', value: 'ROLE_USER' },
    { label: 'Admin', value: 'ROLE_ADMIN' }
];

export const Users: React.FC = () => {
    const [users, setUsers] = useState<UserDetailsDTO[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [pagination, setPagination] = useState({ page: 0, size: 10 });
    const [filter, setFilter] = useState({ username: '', email: '', role: '' });
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = async (filterData: { username: string; email: string; role: string }) => {
        setIsLoading(true);
        try {
            const { content } = await fetchAllUsers(pagination, filterData);
            setUsers(content);
            setTotalCount(content.length);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(filter);
    }, [pagination]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilter(prevFilter => ({ ...prevFilter, [name]: value }));
    };

    const handleRoleChange = (_event: any, newValue: { label: string, value: string } | null) => {
        setFilter(prevFilter => ({ ...prevFilter, role: newValue ? newValue.value : '' }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPagination({ ...pagination, page: 0 });
        fetchUsers(filter);
    };

    const handleDeleteUser = async (username: string) => {
        try {
            await deleteUser(username);
            fetchUsers(filter);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const handleRowsPerPageChange = (newSize: number) => {
        setPagination(prev => ({ ...prev, size: newSize }));
    };

    const columns = [
        { label: 'Username', key: 'username', sortable: true },
        { label: 'Email', key: 'email', sortable: true },
        { label: 'Role', key: 'role', sortable: true },
        { label: 'Actions', key: 'actions' }
    ];

    const renderRow = (user: UserDetailsDTO) => (
        <>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
                <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteUser(user.username)}
                    aria-label={`Delete ${user.username} data`}
                >
                    Delete
                </button>
            </TableCell>
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
                    <Navigation items={sidebarItems} />
                </nav>
                <section className={styles.content}>
                    <header className={styles.contentHeader}>
                        <h2 className={styles.pageTitle}>Users</h2>
                        <UserProfile />
                    </header>
                    <form className={styles.filterForm} onSubmit={handleSubmit}>
                        <div className={styles.filterGroup}>
                            <label htmlFor="username" className={styles.filterLabel}>Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className={styles.filterInput}
                                placeholder="Username"
                                value={filter.username}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className={styles.filterGroup}>
                            <label htmlFor="email" className={styles.filterLabel}>Email</label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                className={styles.filterInput}
                                placeholder="Email"
                                value={filter.email}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className={styles.filterGroup}>
                            <label htmlFor="role" className={styles.filterLabel}>Role</label>
                            <Autocomplete
                                id="role"
                                options={roleOptions}
                                getOptionLabel={(option) => option.label}
                                onChange={handleRoleChange}
                                renderInput={(params) => <TextField {...params} className={styles.filterInput} />}
                            />
                        </div>
                        <button type="submit" className={styles.submitButton}>Search</button>
                    </form>
                    <div className={styles.tableContainer}>
                        <ReusableTable
                            columns={columns}
                            data={users}
                            page={pagination.page}
                            size={pagination.size}
                            totalCount={totalCount}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            renderRow={renderRow}
                        />
                        {isLoading && <LoadingScreen />}
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    );
};