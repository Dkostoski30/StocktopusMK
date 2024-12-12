package mk.finki.ukim.mk.stocktopusbackend.service.impl;

import lombok.RequiredArgsConstructor;
import mk.finki.ukim.mk.stocktopusbackend.model.StockIndicators;
import mk.finki.ukim.mk.stocktopusbackend.repository.StockIndicatorsRepository;
import mk.finki.ukim.mk.stocktopusbackend.service.StockIndicatorsService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StockIndicatorsServiceImpl implements StockIndicatorsService {
    private final StockIndicatorsRepository stockIndicatorsRepository;

    @Override
    public List<StockIndicators> findAll() {
        return stockIndicatorsRepository.findAll();
    }
}
