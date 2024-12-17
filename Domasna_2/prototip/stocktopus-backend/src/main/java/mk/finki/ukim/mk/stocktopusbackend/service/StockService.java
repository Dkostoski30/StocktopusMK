package mk.finki.ukim.mk.stocktopusbackend.service;

import mk.finki.ukim.mk.stocktopusbackend.model.Stock;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDTO;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockPercentageDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface StockService {
    Optional<Stock> findByStockName(String stockName);
    Page<Stock> findAll(Pageable pageable);
    Stock findById(Long id);
    void deleteById(Long id);
    List<StockPercentageDTO> findBestFour();

    Stock editStockById(Long id, StockDTO stockDTO);
}
