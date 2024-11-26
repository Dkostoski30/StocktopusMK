package mk.finki.ukim.mk.stocktopusbackend.service.converter;

import mk.finki.ukim.mk.stocktopusbackend.model.Stock;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDTO;

public interface StockConverterService {
    StockDTO convertToStockDTO(Stock stock);
}
