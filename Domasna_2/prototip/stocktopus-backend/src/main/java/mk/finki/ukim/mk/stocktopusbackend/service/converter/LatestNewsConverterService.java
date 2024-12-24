package mk.finki.ukim.mk.stocktopusbackend.service.converter;

import mk.finki.ukim.mk.stocktopusbackend.model.LatestNews;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.LatestNewsDTO;

public interface LatestNewsConverterService {
    LatestNewsDTO convertToLatestNewsDTO(LatestNews latestNews);
}
