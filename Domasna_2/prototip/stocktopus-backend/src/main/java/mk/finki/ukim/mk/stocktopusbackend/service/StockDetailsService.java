package mk.finki.ukim.mk.stocktopusbackend.service;

import mk.finki.ukim.mk.stocktopusbackend.model.StockDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StockDetailsService {
    Page<StockDetails> findAll(Pageable pageable);
}
