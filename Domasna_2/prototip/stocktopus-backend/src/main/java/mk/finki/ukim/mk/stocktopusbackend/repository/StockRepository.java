package mk.finki.ukim.mk.stocktopusbackend.repository;

import mk.finki.ukim.mk.stocktopusbackend.model.Stock;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockFilter;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockPercentageDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<Stock,Long> {
    Optional<Stock> findByStockName(String stockName);
    @Query("""
            select s from Stock s
            where s.dateDeleted is null
            and (:#{#stockFilter.stockName} is null or :#{#stockFilter.stockName} = '' or lower(s.stockName) like :#{#stockFilter.stockName}%)
            order by s.stockId asc
            """)
    Page<Stock> findAll(Pageable pageable, StockFilter stockFilter);

    @Query(value = "SELECT s.stock_id, s.stock_name, " +
            "CAST(REPLACE(REPLACE(sd.percentage_change, '.', ''), ',', '.') AS NUMERIC) AS stock_percentage " +
            "FROM stockdetails sd " +
            "JOIN stocks s ON sd.stock_id = s.stock_id " +
            "WHERE sd.percentage_change IS NOT NULL AND sd.percentage_change != '' " +
            "AND sd.date = CURRENT_DATE - INTERVAL '1 DAY' " +
            "ORDER BY CAST(REPLACE(REPLACE(sd.percentage_change, '.', ''), ',', '.') AS NUMERIC) DESC " +
            "LIMIT 4",
            nativeQuery = true)
    List<Object[]> getBestFour();

}
