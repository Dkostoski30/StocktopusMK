package mk.finki.ukim.mk.stocktopusbackend.service.converter.impl;

import lombok.RequiredArgsConstructor;
import mk.finki.ukim.mk.stocktopusbackend.model.StockDetails;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDetailsDTO;
import mk.finki.ukim.mk.stocktopusbackend.service.StockService;
import mk.finki.ukim.mk.stocktopusbackend.service.converter.StockDetailsConverterService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StockDetailsConverterImpl implements StockDetailsConverterService {

    private final StockService stockService;

    @Override
    public StockDetailsDTO convertToStockDetailsDTO(StockDetails stockDetails) {
        return new StockDetailsDTO(
                stockDetails.getDetailsId(),
                stockDetails.getStockId(),
                stockService.findById(stockDetails.getStockId()).getStockName(),
                stockDetails.getDate(),
                stockDetails.getLastTransactionPrice(),
                stockDetails.getMaxPrice(),
                stockDetails.getMinPrice(),
                stockDetails.getAveragePrice(),
                stockDetails.getPercentageChange(),
                stockDetails.getQuantity(),
                stockDetails.getTradeVolume(),
                stockDetails.getTotalVolume()
        );
    }

}
