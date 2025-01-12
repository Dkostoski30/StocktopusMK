package mk.finki.ukim.mk.stocktopusbackend.web.rest;

import lombok.RequiredArgsConstructor;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.FavoriteStocksDTO;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDTO;
import mk.finki.ukim.mk.stocktopusbackend.service.FavoriteStocksService;
import mk.finki.ukim.mk.stocktopusbackend.service.converter.StockConverterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/favorite-stocks")
@RequiredArgsConstructor
public class FavoriteStocksController {
    private final FavoriteStocksService favoriteStocksService;
    private final StockConverterService stockConverterService;

    @PostMapping("/add")
    public void addFavoriteStock(@RequestBody FavoriteStocksDTO favoriteStocksDTO) {
        favoriteStocksService.addFavoriteStock(favoriteStocksDTO.username(), favoriteStocksDTO.stockId());
    }

    @DeleteMapping("/remove")
    public void removeFavoriteStock(@RequestBody FavoriteStocksDTO favoriteStocksDTO) {
        favoriteStocksService.removeFavoriteStock(favoriteStocksDTO.username(), favoriteStocksDTO.stockId());
    }

    @GetMapping
    public Page<StockDTO> getFavoriteStocks(@RequestParam String username, Pageable pageable) {
        return favoriteStocksService.getFavoriteStocks(username, pageable)
                .map(stockConverterService::convertToStockDTO);
    }
}
