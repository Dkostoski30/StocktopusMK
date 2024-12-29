package mk.finki.ukim.mk.stocktopusbackend.service.impl;

import lombok.RequiredArgsConstructor;
import mk.finki.ukim.mk.stocktopusbackend.model.StockDetails;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDetailsEditDTO;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDetailsFilter;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDetailsProjection;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDetailsSortingConfig;
import mk.finki.ukim.mk.stocktopusbackend.repository.StockDetailsRepository;
import mk.finki.ukim.mk.stocktopusbackend.service.StockDetailsService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@Service
public class StockDetailsServiceImpl implements StockDetailsService {

    private final StockDetailsRepository stockDetailsRepository;

    @Override
    public Page<StockDetailsProjection> findAll(Pageable pageable, StockDetailsFilter stockDetailsFilter, StockDetailsSortingConfig stockDetailsSortingConfig) {
        return stockDetailsRepository.findAll(pageable, stockDetailsFilter, stockDetailsSortingConfig);
    }

    @Override
    public void deleteById(Long id) {
        stockDetailsRepository.deleteById(id);
    }

    @Override
    public List<StockDetails> getMostTraded() {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        Date sqlYesterday = Date.valueOf(yesterday);
        return stockDetailsRepository.getMostTraded(sqlYesterday);
    }

    @Override
    public Page<StockDetails> findByStockId(Long stockId, Pageable pageable) {
        return stockDetailsRepository.findAllByStockId(stockId,pageable);
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

    public List<StockDetails> findLatestByStockId(Long stockId) {
        LocalDate sevenDaysAgo = LocalDate.now().minusDays(15);
        Date sqlDay = Date.valueOf(sevenDaysAgo);
        return stockDetailsRepository.findByStockIdAndDateAfter(stockId, sqlDay);
    }

//    @Override
//    public Page<StockDetails> findByStockId(Long stockId, Pageable pageable) {
//        return stockDetailsRepository.findAllByStockId(stockId,pageable);
//    }
}
