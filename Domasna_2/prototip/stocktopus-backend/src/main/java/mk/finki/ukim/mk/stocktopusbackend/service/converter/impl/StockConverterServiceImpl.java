package mk.finki.ukim.mk.stocktopusbackend.service.converter.impl;

import mk.finki.ukim.mk.stocktopusbackend.model.Stock;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDTO;
import mk.finki.ukim.mk.stocktopusbackend.service.converter.StockConverterService;
import org.springframework.stereotype.Service;

@Service
public class StockConverterServiceImpl implements StockConverterService {

    @Override
    public StockDTO convertToStockDTO(Stock stock) {
        return new StockDTO(stock.getStockId(), stock.getStockName(), stock.getFullName());
    }
}
