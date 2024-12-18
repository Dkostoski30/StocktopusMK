import React from 'react';
import styles from './FavoritesSection.module.css';

type Favorite = {
    rank: string;
    symbol: string;
    maxPrice: string;
    avgPrice: string;
};

interface FavoritesSectionProps {
    favoriteData: Favorite[];
}

export const FavoritesSection: React.FC<FavoritesSectionProps> = ({ favoriteData }) => {
    return (
        <section className={styles.favoritesSection}>
            <h2 className={styles.sectionTitle}>Favourites</h2>
            <table className={styles.favoritesTable}>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Maximum price</th>
                    <th>Avg. price</th>
                </tr>
                </thead>
                <tbody>
                {favoriteData.map((favorite) => (
                    <tr key={favorite.rank}>
                        <td>{favorite.rank}</td>
                        <td>{favorite.symbol}</td>
                        <td>{favorite.maxPrice}</td>
                        <td>{favorite.avgPrice}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </section>
    );
};
