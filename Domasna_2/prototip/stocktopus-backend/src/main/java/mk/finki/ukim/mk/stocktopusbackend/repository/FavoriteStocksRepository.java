package mk.finki.ukim.mk.stocktopusbackend.repository;

import mk.finki.ukim.mk.stocktopusbackend.model.FavoriteStocks;
import mk.finki.ukim.mk.stocktopusbackend.model.Stock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface FavoriteStocksRepository extends JpaRepository<FavoriteStocks, Long> {

    @Transactional
    @Modifying
    @Query("INSERT INTO FavoriteStocks(username, stockId) VALUES (:username, :stockId)")
    void addFavoriteStock(String username, Long stockId);

    @Transactional
    @Modifying
    @Query("DELETE FROM FavoriteStocks fs WHERE fs.username = :username AND fs.stockId = :stockId")
    void removeFavoriteStock(String username, Long stockId);

    @Query("""
                SELECT s
                FROM Stock s
                JOIN s.favoriteStocks fs
                WHERE fs.username = :username AND s.dateDeleted IS NULL
                ORDER BY fs.id DESC
            """)
    Page<Stock> getFavoriteStocks(String username, Pageable pageable);
}
