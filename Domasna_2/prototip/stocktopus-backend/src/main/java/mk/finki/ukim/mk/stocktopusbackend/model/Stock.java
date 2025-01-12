package mk.finki.ukim.mk.stocktopusbackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@Table(name = "stocks")
@SQLDelete(sql = "UPDATE stocks SET date_deleted = CURRENT_TIMESTAMP WHERE stock_id = ?")
public class Stock {
    @Id
    @Column(name = "stock_id")
    private Long stockId;

    @Column(name = "stock_name")
    private String stockName;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "date_deleted")
    private LocalDateTime dateDeleted;

    @OneToMany(mappedBy = "stockId")
    private List<NewsAndStocks> newsAndStocks;

    @OneToMany(mappedBy = "stockId")
    private List<FavoriteStocks> favoriteStocks;
}

