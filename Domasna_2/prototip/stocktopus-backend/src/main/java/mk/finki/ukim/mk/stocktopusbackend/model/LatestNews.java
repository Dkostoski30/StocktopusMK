package mk.finki.ukim.mk.stocktopusbackend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@Table(name = "latest_news")
public class LatestNews {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "date")
    private Date date;

    @Column(name = "text")
    private String text;

    @Column(name = "sentiment")
    private String sentiment;

    @OneToMany(mappedBy = "latestNewsId")
    private List<NewsAndStocks> newsAndStocks;
}
