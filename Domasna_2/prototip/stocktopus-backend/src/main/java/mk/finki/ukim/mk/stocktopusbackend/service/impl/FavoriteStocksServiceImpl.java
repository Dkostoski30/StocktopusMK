package mk.finki.ukim.mk.stocktopusbackend.service.impl;

import lombok.RequiredArgsConstructor;
import mk.finki.ukim.mk.stocktopusbackend.model.Stock;
import mk.finki.ukim.mk.stocktopusbackend.repository.FavoriteStocksRepository;
import mk.finki.ukim.mk.stocktopusbackend.service.FavoriteStocksService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FavoriteStocksServiceImpl implements FavoriteStocksService {
    private final FavoriteStocksRepository favoriteStocksRepository;

    @Override
    public void addFavoriteStock(String username, Long stockId) {
        favoriteStocksRepository.addFavoriteStock(username, stockId);
    }

    @Override
    public void removeFavoriteStock(String username, Long stockId) {
        favoriteStocksRepository.removeFavoriteStock(username, stockId);
    }

    @Override
    public Page<Stock> getFavoriteStocks(String username, Pageable pageable) {
        return favoriteStocksRepository.getFavoriteStocks(username, pageable);
    }
}
