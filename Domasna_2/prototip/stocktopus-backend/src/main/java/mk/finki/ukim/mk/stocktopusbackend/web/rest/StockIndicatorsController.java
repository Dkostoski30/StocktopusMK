package mk.finki.ukim.mk.stocktopusbackend.web.rest;

import lombok.RequiredArgsConstructor;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockIndicatorsDTO;
import mk.finki.ukim.mk.stocktopusbackend.service.StockIndicatorsService;
import mk.finki.ukim.mk.stocktopusbackend.service.converter.StockIndicatorsConverterService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stock-indicators")
@RequiredArgsConstructor
public class StockIndicatorsController {
    private final StockIndicatorsService stockIndicatorsService;
    private final StockIndicatorsConverterService stockIndicatorsConverterService;

    @GetMapping
    public List<StockIndicatorsDTO> findAll() {
        return this.stockIndicatorsService.findAll()
                .stream().map(stockIndicatorsConverterService::convertToStockIndicatorsDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public List<StockIndicatorsDTO> findByStockId(@PathVariable Long id) {
        return this.stockIndicatorsService.findByStockId(id)
                .stream().map(stockIndicatorsConverterService::convertToStockIndicatorsDTO)
                .toList();
    }
}
