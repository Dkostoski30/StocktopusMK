package mk.finki.ukim.mk.stocktopusbackend.service;

import mk.finki.ukim.mk.stocktopusbackend.model.LatestNews;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface LatestNewsService {
    Page<LatestNews> getLatestNewsByStockId(Pageable pageable, Long stockId);
}
