package mk.finki.ukim.mk.stocktopusbackend.model.dto;

public record StockDetailsEditDTO(
        String lastTransactionPrice,
        String maxPrice,
        String minPrice,
        String averagePrice,
        String percentageChange,
        String quantity,
        String tradeVolume,
        String totalVolume
) {}
