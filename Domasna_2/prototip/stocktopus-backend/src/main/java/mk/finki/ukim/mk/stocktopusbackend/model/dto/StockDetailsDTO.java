package mk.finki.ukim.mk.stocktopusbackend.model.dto;

import java.util.Date;

public record StockDetailsDTO(
        String id,
        Long stockId,
        String stockName,
        Date date,
        String lastTransactionPrice,
        String maxPrice,
        String minPrice,
        String averagePrice,
        String percentageChange,
        String quantity,
        String tradeVolume,
        String totalVolume
) {}
