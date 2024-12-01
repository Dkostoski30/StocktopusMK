package mk.finki.ukim.mk.stocktopusbackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "stocks")
public class Stock {
    @Id
    @Column(name = "stock_id")
    private Long stockId;

    @Column(name = "stock_name")
    private String stockName;
}

