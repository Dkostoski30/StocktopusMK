package mk.finki.ukim.mk.stocktopusbackend.service.converter;

import mk.finki.ukim.mk.stocktopusbackend.model.StockDetails;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDetailsDTO;

public interface StockDetailsConverterService {
    StockDetailsDTO convertToStockDetailsDTO(StockDetails stockDetails);
}
