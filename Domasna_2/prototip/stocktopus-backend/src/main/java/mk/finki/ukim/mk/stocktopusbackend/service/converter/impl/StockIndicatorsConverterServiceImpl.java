package mk.finki.ukim.mk.stocktopusbackend.service.converter.impl;

import mk.finki.ukim.mk.stocktopusbackend.model.StockIndicators;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockIndicatorsDTO;
import mk.finki.ukim.mk.stocktopusbackend.service.converter.StockIndicatorsConverterService;
import org.springframework.stereotype.Service;

@Service
public class StockIndicatorsConverterServiceImpl implements StockIndicatorsConverterService {
    @Override
    public StockIndicatorsDTO convertToStockIndicatorsDTO(StockIndicators stockIndicators) {
        return new StockIndicatorsDTO(
                stockIndicators.getId(),
                stockIndicators.getStockId(),
                stockIndicators.getDate(),
                stockIndicators.getTimeframe(),
                stockIndicators.getSma50(),
                stockIndicators.getEma50(),
                stockIndicators.getRsi(),
                stockIndicators.getMacd(),
                stockIndicators.getSignalValue(),
                stockIndicators.getDecision() != null ? stockIndicators.getDecision() : null
        );    }
}
