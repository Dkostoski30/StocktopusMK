package mk.finki.ukim.mk.stocktopusbackend.model.dto;

import mk.finki.ukim.mk.stocktopusbackend.model.NewsAndStocks;

import java.util.Date;
import java.util.List;

public record NewsDTO(
        Long id,
        Date date,
        String text,
        String sentiment,
        List<NewsAndStocks> newsAndStocks
) {}