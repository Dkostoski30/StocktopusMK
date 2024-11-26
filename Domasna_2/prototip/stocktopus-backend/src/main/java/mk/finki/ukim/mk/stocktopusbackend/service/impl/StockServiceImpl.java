package mk.finki.ukim.mk.stocktopusbackend.service.impl;

import mk.finki.ukim.mk.stocktopusbackend.model.Stock;
import mk.finki.ukim.mk.stocktopusbackend.repository.StockRepository;
import mk.finki.ukim.mk.stocktopusbackend.service.StockService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StockServiceImpl implements StockService {

    private final StockRepository stockRepository;

    public StockServiceImpl(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    @Override
    public Optional<Stock> findByStockName(String stockName) {
        return stockRepository.findByStockName(stockName);
    }

    @Override
    public List<Stock> findAll() {
        return stockRepository.findAll();
    }
}
