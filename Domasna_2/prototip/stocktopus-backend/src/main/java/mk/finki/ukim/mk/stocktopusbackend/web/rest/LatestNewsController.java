package mk.finki.ukim.mk.stocktopusbackend.web.rest;

import lombok.RequiredArgsConstructor;
import mk.finki.ukim.mk.stocktopusbackend.model.LatestNews;
import mk.finki.ukim.mk.stocktopusbackend.service.LatestNewsService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/latest-news")
@RequiredArgsConstructor
public class LatestNewsController {

    private final LatestNewsService latestNewsService;

    @GetMapping("/latestByStock/{stockId}")
    public Page<LatestNews> getLatestNewsByStockId(Pageable pageable, @PathVariable Long stockId) {
        return latestNewsService.getLatestNewsByStockId(pageable,stockId);
    }
}
