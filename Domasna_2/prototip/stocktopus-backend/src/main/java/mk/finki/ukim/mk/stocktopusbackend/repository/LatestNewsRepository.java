package mk.finki.ukim.mk.stocktopusbackend.repository;

import mk.finki.ukim.mk.stocktopusbackend.model.LatestNews;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LatestNewsRepository extends JpaRepository<LatestNews, Long> {

    @Query("""
        SELECT lnews.id, SUBSTRING(lnews.text, 1, 500)
        FROM LatestNews lnews
        JOIN lnews.newsAndStocks nas
        WHERE nas.stockId = :stockId
    """)
    Page<LatestNews> getLatestNewsByStockId(Pageable pageable, @Param("stockId") Long stockId);


}
