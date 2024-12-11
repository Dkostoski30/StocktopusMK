package mk.finki.ukim.mk.stocktopusbackend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@Table(name = "stocks_indicators")
public class StockIndicators {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "stock_id")
    private Long stockId;

    private Date date;

    private String timeframe;

    @Column(name = "sma_50")
    private Double sma50;

    @Column(name = "ema_50")
    private Double ema50;

    private Double rsi;

    private Double macd;

    @Column(name = "signal_value")
    private Double signalValue;

    private String decision;
}
