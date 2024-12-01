package mk.finki.ukim.mk.stocktopusbackend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@Table(name = "stockdetails")
public class StockDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long detailsId;

    @Column(name = "stock_id")
    private Long stockId;

    @Column(name = "date")
    private Date date;

    @Column(name= "last_transaction_price")
    private String lastTransactionPrice;

    @Column(name="max_price")
    private String maxPrice;

    @Column(name="min_price")
    private String minPrice;

    @Column(name="average_price")
    private String averagePrice;

    @Column(name="percentage_change")
    private String percentageChange;

    @Column (name="quantity")
    private String quantity;

    @Column (name="trade_volume")
    private String tradeVolume;

    @Column (name="total_volume")
    private String totalVolume;
}
