package mk.finki.ukim.mk.stocktopusbackend.service.impl;

import lombok.RequiredArgsConstructor;
import mk.finki.ukim.mk.stocktopusbackend.model.Stock;
import mk.finki.ukim.mk.stocktopusbackend.repository.StockRepository;
import mk.finki.ukim.mk.stocktopusbackend.service.StockService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StockServiceImpl implements StockService {

    private final StockRepository stockRepository;

    @Override
    public Optional<Stock> findByStockName(String stockName) {
        return stockRepository.findByStockName(stockName);
    }

    @Override
    public Page<Stock> findAll(Pageable pageable) {
        return stockRepository.findAll(pageable);
    }

    @Override
    public Stock findById(Long id) {
        return stockRepository.findById(id).get(); //TODO: add exception handling
    }

    @Override
    public void deleteById(Long id) {
        stockRepository.deleteById(id);
    }
}
