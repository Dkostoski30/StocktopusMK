package mk.finki.ukim.mk.stocktopusbackend.service.impl;

import lombok.RequiredArgsConstructor;
import mk.finki.ukim.mk.stocktopusbackend.model.StockDetails;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDetailsEditDTO;
import mk.finki.ukim.mk.stocktopusbackend.repository.StockDetailsRepository;
import mk.finki.ukim.mk.stocktopusbackend.service.StockDetailsService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class StockDetailsServiceImpl implements StockDetailsService {

    private final StockDetailsRepository stockDetailsRepository;

    @Override
    public Page<StockDetails> findAll(Pageable pageable) {
        return stockDetailsRepository.findAll(pageable);
    }

    @Override
    public void deleteById(Long id) {
        stockDetailsRepository.deleteById(id);
    }

    @Override
    public StockDetails editStockDetails(Long id, StockDetailsEditDTO stockDetailsDTO) {
        StockDetails stockDetails = stockDetailsRepository.findById(id).orElseThrow(RuntimeException::new); // TODO: add exception handling
        stockDetails.setLastTransactionPrice(stockDetailsDTO.lastTransactionPrice());
        stockDetails.setMaxPrice(stockDetailsDTO.maxPrice());
        stockDetails.setMinPrice(stockDetailsDTO.minPrice());
        stockDetails.setAveragePrice(stockDetailsDTO.averagePrice());
        stockDetails.setPercentageChange(stockDetailsDTO.percentageChange());
        stockDetails.setQuantity(stockDetailsDTO.quantity());
        stockDetails.setTradeVolume(stockDetailsDTO.tradeVolume());
        stockDetails.setTotalVolume(stockDetailsDTO.totalVolume());
        return stockDetailsRepository.save(stockDetails);
    }
}
