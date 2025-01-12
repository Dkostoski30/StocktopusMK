package mk.finki.ukim.mk.stocktopusbackend.model;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Data
public class FavoriteStocks {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "username", insertable = false, updatable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @Column(name = "username")
    private String username;

    @JoinColumn(name = "stock_id", insertable = false, updatable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private Stock stock;

    @Column(name = "stock_id")
    private Long stockId;
}
