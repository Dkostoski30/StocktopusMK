package mk.finki.ukim.mk.stocktopusbackend.repository;

import mk.finki.ukim.mk.stocktopusbackend.model.StockDetails;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDetailsFilter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StockDetailsRepository extends JpaRepository<StockDetails,Long> {


    @Query("""
            select sd from StockDetails sd
            join Stock s on sd.stockId = s.stockId
            where s.dateDeleted is null
            and (:#{#stockDetailsFilter.stockName} is null or :#{#stockDetailsFilter.stockName} = '' or lower(s.stockName) like :#{#stockDetailsFilter.stockName}%)
            and (:#{#stockDetailsFilter.dateFrom} is null or :#{#stockDetailsFilter.dateFrom} = '' or to_char(sd.date, 'YYYY-MM-DD') >= :#{#stockDetailsFilter.dateFrom})
            and (:#{#stockDetailsFilter.dateTo} is null or :#{#stockDetailsFilter.dateTo} = '' or to_char(sd.date, 'YYYY-MM-DD') <= :#{#stockDetailsFilter.dateTo})
            order by sd.date desc
            """)
    Page<StockDetails> findAll(Pageable pageable, StockDetailsFilter stockDetailsFilter);
    @Query("""
    SELECT sd
    FROM StockDetails sd
    JOIN Stock s ON sd.stockId = s.stockId
    WHERE sd.date = :yesterday
    ORDER BY sd.tradeVolume DESC
    LIMIT 10
""")
    List<StockDetails> getMostTraded(@Param("yesterday") java.sql.Date yesterday);
}
