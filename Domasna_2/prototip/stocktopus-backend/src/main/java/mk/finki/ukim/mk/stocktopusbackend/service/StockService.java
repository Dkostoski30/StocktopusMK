package mk.finki.ukim.mk.stocktopusbackend.service;

import mk.finki.ukim.mk.stocktopusbackend.model.Stock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface StockService {
    Optional<Stock> findByStockName(String stockName);
    Page<Stock> findAll(Pageable pageable);
    Stock findById(Long id);
    void deleteById(Long id);
}
