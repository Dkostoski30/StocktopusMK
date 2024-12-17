package mk.finki.ukim.mk.stocktopusbackend.web.rest;

import lombok.RequiredArgsConstructor;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDetailsDTO;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDetailsEditDTO;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDetailsFilter;
import mk.finki.ukim.mk.stocktopusbackend.service.StockDetailsService;
import mk.finki.ukim.mk.stocktopusbackend.service.converter.StockDetailsConverterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stock-details")
@RequiredArgsConstructor
public class StockDetailsController {
    private final StockDetailsService stockDetailsService;
    private final StockDetailsConverterService stockDetailsConverterService;

    @GetMapping
    public Page<StockDetailsDTO> findAll(Pageable pageable,
                                         @RequestParam (required = false) String stockName,
                                         @RequestParam (required = false) String dateFrom,
                                         @RequestParam (required = false) String dateTo){
        StockDetailsFilter stockDetailsFilter = new StockDetailsFilter(stockName, dateFrom, dateTo);
        return this.stockDetailsService.findAll(pageable, stockDetailsFilter)
                .map(stockDetailsConverterService::convertToStockDetailsDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteStock(@PathVariable Long id){
        stockDetailsService.deleteById(id);
    }

    @PostMapping("/edit/{id}")
    public StockDetailsEditDTO editStock(@PathVariable Long id, @RequestBody StockDetailsEditDTO stockDetailsEditDTO){
        return stockDetailsConverterService.convertToStockDetailsEditDTO(stockDetailsService.editStockDetails(id, stockDetailsEditDTO));
    }
}
