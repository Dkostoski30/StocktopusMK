package mk.finki.ukim.mk.stocktopusbackend.web.rest;

import lombok.RequiredArgsConstructor;
import mk.finki.ukim.mk.stocktopusbackend.model.StockDetails;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDetailsDTO;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDetailsEditDTO;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDetailsFilter;
import mk.finki.ukim.mk.stocktopusbackend.service.StockDetailsService;
import mk.finki.ukim.mk.stocktopusbackend.service.converter.StockDetailsConverterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
    @GetMapping("/getMostTraded")
    public List<StockDetailsDTO> getMostTraded(){
        return stockDetailsService.getMostTraded()
                .stream()
                .map(stockDetailsConverterService::convertToStockDetailsDTO)
                .toList();
    }
    @GetMapping("/{stockId}")
    public Page<StockDetails> findByStockId(@PathVariable Long stockId, Pageable pageable) {
        return stockDetailsService.findByStockId(stockId, pageable);
    }

    @GetMapping("/latest/{stockId}")
    public List<StockDetailsDTO> findLatestByStockId(@PathVariable Long stockId) {
        return stockDetailsService.findLatestByStockId(stockId)
                .stream()
                .map(stockDetailsConverterService::convertToStockDetailsDTO)
                .toList();
    }

    @GetMapping("/exportMostTraded")
    public ResponseEntity<byte[]> exportMostTraded() {
        List<StockDetailsDTO> stockDetails = stockDetailsService.getMostTraded()
                .stream()
                .map(stockDetailsConverterService::convertToStockDetailsDTO)
                .toList();

        StringBuilder csvData = new StringBuilder();
        csvData.append("DetailsId,StockId,StockName,Date,LastTransactionPrice,MaxPrice,MinPrice,AveragePrice,PercentageChange,Quantity,TradeVolume,TotalVolume\n");

        stockDetails.forEach(stock -> {
            csvData.append(stock.detailsId()).append(",")
                    .append(stock.stockId()).append(",")
                    .append(stock.stockName()).append(",")
                    .append(stock.date()).append(",")
                    .append(stock.lastTransactionPrice().replace(",", "")).append(",")
                    .append(stock.maxPrice().replace(",", "")).append(",")
                    .append(stock.minPrice().replace(",", "")).append(",")
                    .append(stock.averagePrice().replace(",", "")).append(",")
                    .append(stock.percentageChange().replace(",", ".")).append(",")
                    .append(stock.quantity()).append(",")
                    .append(stock.tradeVolume().replace(".", "")).append(",")
                    .append(stock.totalVolume().replace(".", "")).append("\n");
        });

        byte[] csvBytes = csvData.toString().getBytes();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"most_traded_stocks.csv\"")
                .header(HttpHeaders.CONTENT_TYPE, "text/csv")
                .body(csvBytes);
    }

}
