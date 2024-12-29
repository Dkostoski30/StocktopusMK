package mk.finki.ukim.mk.stocktopusbackend.repository;

import mk.finki.ukim.mk.stocktopusbackend.model.StockDetails;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDetailsFilter;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDetailsProjection;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDetailsSortingConfig;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;

public interface StockDetailsRepository extends JpaRepository<StockDetails,Long> {

    @Query(value = """
    SELECT * FROM get_stock_details(
        :#{#stockDetailsFilter.stockName},
        :#{#stockDetailsFilter.dateFrom},
        :#{#stockDetailsFilter.dateTo},
        :#{#stockDetailsSortingConfig.sortBy},
        :#{#stockDetailsSortingConfig.sortOrder}
    )
    """, nativeQuery = true)
    Page<StockDetailsProjection> findAll(Pageable pageable, StockDetailsFilter stockDetailsFilter, StockDetailsSortingConfig stockDetailsSortingConfig);

    @Query("""
    SELECT sd
    FROM StockDetails sd
    JOIN Stock s ON sd.stockId = s.stockId
    WHERE sd.date = :yesterday
    ORDER BY sd.tradeVolume DESC
    LIMIT 10
""")
    List<StockDetails> getMostTraded(@Param("yesterday") java.sql.Date yesterday);

    Page<StockDetails> findAllByStockId(Long stockId, Pageable pageable);

    @Query("SELECT sd FROM StockDetails sd WHERE sd.stockId = :stockId AND sd.date >= :dateAfter order by sd.date")
    List<StockDetails> findByStockIdAndDateAfter(@Param("stockId") Long stockId, @Param("dateAfter") Date dateAfter);

}
