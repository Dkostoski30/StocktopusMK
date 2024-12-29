import React, { useEffect, useState } from 'react';
import styles from './FavoritesSection.module.css';
import { StockDTO } from "../../model/dto/stockDTO.ts";
import { getFavoriteStocks, removeFavoriteStock } from "../../service/favoriteStocksService.ts";
import { TablePagination } from "@mui/material";

interface FavoriteStocksProps {
    username: string;
}

export const FavoritesSection: React.FC<FavoriteStocksProps> = ({ username }) => {
    const [items, setItems] = useState<StockDTO[]>([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(25);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        loadFavoriteStocks();
    }, [page, size]);

    const loadFavoriteStocks = async () => {
        try {
            const response = await getFavoriteStocks({ username, page, size });
            setItems(response.content);
            setTotalCount(response.totalElements);
        } catch (error) {
            console.error("Error loading favorite stocks:", error);
        }
    };

    const handleRemoveFavorite = async (stockId: number) => {
        try {
            await removeFavoriteStock({ username, stockId: stockId });
            setItems((prevItems) => prevItems.filter((item) => item.stockId !== stockId));
        } catch (error) {
            console.error("Error removing favorite stock:", error);
        }
    };

    const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSize(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <section className={styles.favoritesSection}>
            <h2 className={styles.sectionTitle}>Favorites</h2>
            <table className={styles.favoritesTable}>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Company Name</th>
                    <th>Stock Name</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {items.map((favorite) => (
                    <tr key={favorite.stockId}>
                        <td>{favorite.stockId}</td>
                        <td>{favorite.fullName}</td>
                        <td>{favorite.stockName}</td>
                        <td className={styles.favoriteColumn}>
                            <button
                                onClick={() => handleRemoveFavorite(favorite.stockId)}
                                className={`${styles.favoriteButton} ${styles.filledHeart}`}
                            >
                                ♥
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={size}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </section>
    );
};
