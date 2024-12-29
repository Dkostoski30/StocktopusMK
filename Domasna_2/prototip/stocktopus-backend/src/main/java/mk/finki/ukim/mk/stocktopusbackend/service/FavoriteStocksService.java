package mk.finki.ukim.mk.stocktopusbackend.service;

import mk.finki.ukim.mk.stocktopusbackend.model.Stock;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FavoriteStocksService {
    void addFavoriteStock(String username, Long stockId);

    void removeFavoriteStock(String username, Long stockId);

    Page<Stock> getFavoriteStocks(String username, Pageable pageable);
}
