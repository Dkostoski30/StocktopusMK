package mk.finki.ukim.mk.stocktopusbackend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "news_and_stocks")
public class NewsAndStocks {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @JoinColumn(name = "stock_id", insertable = false, updatable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private Stock stock;

    @Column(name = "stock_id")
    private Long stockId;

    @JoinColumn(name = "latest_news_id", insertable = false, updatable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private LatestNews latestNews;

    @Column(name = "latest_news_id")
    private Long latestNewsId;
}
