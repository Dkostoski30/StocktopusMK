package mk.finki.ukim.mk.stocktopusbackend.model.dto;

import java.util.Date;

public record StockIndicatorsDTO(Long id,
                                 Long stockId,
                                 Date date,
                                 String timeframe,
                                 Double sma50,
                                 Double ema50,
                                 Double rsi,
                                 Double macd,
                                 Double signalValue,
                                 String decision) {
}