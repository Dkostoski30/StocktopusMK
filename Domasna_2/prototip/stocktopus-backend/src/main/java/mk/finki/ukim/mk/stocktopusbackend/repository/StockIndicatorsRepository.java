package mk.finki.ukim.mk.stocktopusbackend.repository;

import mk.finki.ukim.mk.stocktopusbackend.model.StockIndicators;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockIndicatorsRepository extends JpaRepository<StockIndicators, Long> {

    @Query("""
    select s from StockIndicators s
    where s.stockId = :id
      and s.sma50 is not null
      and (cast(s.sma50 as string) != 'NaN')
      and s.timeframe = 'monthly'
""")
    List<StockIndicators> findByStockId(@Param("id") Long id);

}
