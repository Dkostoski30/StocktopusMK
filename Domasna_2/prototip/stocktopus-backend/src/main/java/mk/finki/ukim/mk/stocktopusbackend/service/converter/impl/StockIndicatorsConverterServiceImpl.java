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
                stockIndicators.getSma200(),
                stockIndicators.getEma50(),
                stockIndicators.getEma200(),
                stockIndicators.getRsi(),
                stockIndicators.getMacd(),
                stockIndicators.getStochasticOscillator(),
                stockIndicators.getCci(),
                stockIndicators.getWilliamsR(),
                stockIndicators.getBollingerHigh(),
                stockIndicators.getBollingerLow(),
                stockIndicators.getSignal()
        );
    }
}