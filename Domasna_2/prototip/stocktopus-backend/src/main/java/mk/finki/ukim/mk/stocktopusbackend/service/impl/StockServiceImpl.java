package mk.finki.ukim.mk.stocktopusbackend.service.impl;

import lombok.RequiredArgsConstructor;
import mk.finki.ukim.mk.stocktopusbackend.model.Stock;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDTO;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockFilter;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockPercentageDTO;
import mk.finki.ukim.mk.stocktopusbackend.repository.StockRepository;
import mk.finki.ukim.mk.stocktopusbackend.service.StockService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
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
    public Page<Stock> findAll(Pageable pageable, StockFilter stockFilter) {
        return stockRepository.findAll(pageable, stockFilter);
    }

    @Override
    public Stock findById(Long id) {
        return stockRepository.findById(id).get(); //TODO: add exception handling
    }

    @Override
    public void deleteById(Long id) {
        stockRepository.deleteById(id);
    }

    @Override
    public List<StockPercentageDTO> findBestFour() {
        List<Object[]> rawResults = stockRepository.getBestFour();

        return rawResults.stream()
                .map(record -> new StockPercentageDTO(
                        ((Number) record[0]).longValue(), // stockId
                        (String) record[1],               // stockName
                        ((Number) record[2]).doubleValue() // stockPercentage
                ))
                .toList();
    }

    @Override
    public Stock editStockById(Long id, StockDTO stockDTO) {
        Stock stock = stockRepository.findById(id).orElseThrow(RuntimeException::new); // TODO add exception handling
        stock.setStockName(stockDTO.stockName());
        return stockRepository.save(stock);
    }
}
