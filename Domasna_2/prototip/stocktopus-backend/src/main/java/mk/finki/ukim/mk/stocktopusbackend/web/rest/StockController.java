package mk.finki.ukim.mk.stocktopusbackend.web.rest;

import lombok.RequiredArgsConstructor;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDTO;
import mk.finki.ukim.mk.stocktopusbackend.service.StockService;
import mk.finki.ukim.mk.stocktopusbackend.service.converter.StockConverterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stocks")
@RequiredArgsConstructor
public class StockController {
    private final StockService stockService;
    private final StockConverterService stockConverterService;

    @GetMapping
    public Page<StockDTO> findAll(Pageable pageable) {
        return this.stockService.findAll(pageable)
                .map(stockConverterService::convertToStockDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteStock(@PathVariable Long id){
        stockService.deleteById(id);
    }
}
