package mk.finki.ukim.mk.stocktopusbackend.service;


import mk.finki.ukim.mk.stocktopusbackend.model.Stock;

import java.util.List;
import java.util.Optional;

public interface StockService {
    Optional<Stock> findByStockName(String stockName);
    List<Stock> findAll();
}
