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

    @Column(name = "sma_200")
    private Double sma200;

    @Column(name = "ema_50")
    private Double ema50;

    @Column(name = "ema_200")
    private Double ema200;

    private Double rsi;

    private Double macd;

    @Column(name = "stochastic_oscillator")
    private Double stochasticOscillator;

    private Double cci;

    @Column(name = "williams_r")
    private Double williamsR;

    @Column(name = "bollinger_high")
    private Double bollingerHigh;

    @Column(name = "bollinger_low")
    private Double bollingerLow;

    @Column(name = "signal")
    private String signal;
}