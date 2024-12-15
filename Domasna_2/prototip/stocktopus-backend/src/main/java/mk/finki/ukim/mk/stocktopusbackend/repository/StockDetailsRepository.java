package mk.finki.ukim.mk.stocktopusbackend.repository;

import mk.finki.ukim.mk.stocktopusbackend.model.StockDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface StockDetailsRepository extends JpaRepository<StockDetails,Long> {
    @Query("""
            select sd from StockDetails sd
            join Stock s on sd.stockId = s.stockId
            where s.dateDeleted is null
            ORDER BY sd.date DESC
            """)
    Page<StockDetails> findAll(Pageable pageable);
}
