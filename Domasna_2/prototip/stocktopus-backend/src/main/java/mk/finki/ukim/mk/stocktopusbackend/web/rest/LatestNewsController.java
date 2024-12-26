package mk.finki.ukim.mk.stocktopusbackend.web.rest;

import lombok.RequiredArgsConstructor;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.LatestNewsDTO;
import mk.finki.ukim.mk.stocktopusbackend.service.LatestNewsService;
import mk.finki.ukim.mk.stocktopusbackend.service.converter.LatestNewsConverterService;
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
    private final LatestNewsConverterService latestNewsConverterService;

    @GetMapping("/latestByStock/{stockId}")
    public Page<LatestNewsDTO> getLatestNewsByStockId(Pageable pageable, @PathVariable Long stockId) {
        return latestNewsService.getLatestNewsByStockId(pageable, stockId)
                .map(latestNewsConverterService::convertToLatestNewsDTO);
    }
}
