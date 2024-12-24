package mk.finki.ukim.mk.stocktopusbackend.service.converter.impl;

import mk.finki.ukim.mk.stocktopusbackend.model.LatestNews;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.LatestNewsDTO;
import mk.finki.ukim.mk.stocktopusbackend.service.converter.LatestNewsConverterService;
import org.springframework.stereotype.Service;

@Service
public class LatestNewsConverterServiceImpl implements LatestNewsConverterService {

    @Override
    public LatestNewsDTO convertToLatestNewsDTO(LatestNews latestNews) {
        return new LatestNewsDTO(latestNews.getId(),latestNews.getDate(),latestNews.getText(),latestNews.getSentiment());
    }
}
