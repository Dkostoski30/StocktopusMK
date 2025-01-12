package mk.finki.ukim.mk.stocktopusbackend.service;

import mk.finki.ukim.mk.stocktopusbackend.model.StockIndicators;

import java.util.List;

public interface StockIndicatorsService {
    List<StockIndicators> findAll();

    StockIndicators findById(Long id);

    List<StockIndicators> findByStockId(Long id);
}
