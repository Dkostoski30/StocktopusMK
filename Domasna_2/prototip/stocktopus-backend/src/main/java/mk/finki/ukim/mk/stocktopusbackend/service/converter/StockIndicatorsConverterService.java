package mk.finki.ukim.mk.stocktopusbackend.service.converter;

import mk.finki.ukim.mk.stocktopusbackend.model.StockIndicators;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockIndicatorsDTO;
import org.springframework.stereotype.Service;

@Service
public interface StockIndicatorsConverterService {
    StockIndicatorsDTO convertToStockIndicatorsDTO(StockIndicators stockIndicators);
}
