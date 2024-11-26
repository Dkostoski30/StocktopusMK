package mk.finki.ukim.mk.stocktopusbackend.service.converter.impl;

import mk.finki.ukim.mk.stocktopusbackend.model.StockDetails;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDetailsDTO;
import mk.finki.ukim.mk.stocktopusbackend.service.converter.StockDetailsConverterService;
import org.springframework.stereotype.Service;

@Service
public class StockDetailsConverterImpl implements StockDetailsConverterService {
    @Override
    public StockDetailsDTO convertToStockDetailsDTO(StockDetails stockDetails) {
        return new StockDetailsDTO(
                stockDetails.getId(),
                stockDetails.getStockId(),
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
