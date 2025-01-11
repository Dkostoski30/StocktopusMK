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
interface SidebarItem {
    icon: string;
    label: string;
    path: string;
    isActive: boolean;
}

const sidebarItems: SidebarItem[] = [
    { icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/f82a8295d3dcfe19d1110553350c5151b3590b9747973a89f58114ed3ae4775d?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', label: 'Historic data', path: '/admin/historic-data', isActive: false },
    { icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/b328694d610eca444166961c972325a5cd97af94df16694bcf61bff11793da87?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', label: 'Stocks', path: '/admin/stocks', isActive: false },
    { icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/170996ea976592f23f0dc12558b6946a7ce322f5ecff2f0a0341da620be554d6?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', label: 'Users', path: '/admin/users', isActive: true },
    { icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/3a442f00011bfdbf7a7cab35a09d701dda8da4ee43a4154bdc25a8467e88124b?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078', label: 'Back to Home Page', path: '/', isActive: false }
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

    const fetchUsers = async () => {
        try {
            const { content } = await fetchAllUsers(pagination, filter);
            console.log('Filtered Users:', content); // Log API response
            setUsers(content);
            setTotalCount(content.length);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [pagination, filter]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilter(prevFilter => ({ ...prevFilter, [name]: value }));
        setPagination({ ...pagination, page: 0 });
    };

    const handleRoleChange = (_event: any, newValue: { label: string, value: string } | null) => {
        setFilter(prevFilter => ({ ...prevFilter, role: newValue ? newValue.value : '' }));
        setPagination({ ...pagination, page: 0 });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetchUsers();
    };

    const handleDeleteUser = async (username: string) => {
        try {
            await deleteUser(username);
            fetchUsers();
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
                                renderInput={(params) => <TextField {...params}  className={styles.filterInput} />}
                            />
                        </div>
                        <button type="submit" className={styles.submitButton}>Search</button>
                    </form>
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
                </section>
            </div>
            <Footer />
        </main>
    );
};