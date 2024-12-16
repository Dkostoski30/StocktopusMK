package mk.finki.ukim.mk.stocktopusbackend.service;

import mk.finki.ukim.mk.stocktopusbackend.model.StockDetails;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDetailsDTO;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDetailsEditDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StockDetailsService {
    Page<StockDetails> findAll(Pageable pageable);

    void deleteById(Long id);

    StockDetails editStockDetails(Long id, StockDetailsEditDTO stockDetailsDTO);
}
