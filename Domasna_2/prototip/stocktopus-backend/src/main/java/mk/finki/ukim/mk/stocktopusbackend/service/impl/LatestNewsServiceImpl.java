package mk.finki.ukim.mk.stocktopusbackend.service.impl;

import lombok.RequiredArgsConstructor;
import mk.finki.ukim.mk.stocktopusbackend.model.LatestNews;
import mk.finki.ukim.mk.stocktopusbackend.repository.LatestNewsRepository;
import mk.finki.ukim.mk.stocktopusbackend.service.LatestNewsService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LatestNewsServiceImpl implements LatestNewsService {
    private final LatestNewsRepository latestNewsRepository;

    @Override
    public Page<LatestNews> getLatestNewsByStockId(Pageable pageable, Long stockId) {
        return latestNewsRepository.getLatestNewsByStockId(pageable, stockId);
    }
}
