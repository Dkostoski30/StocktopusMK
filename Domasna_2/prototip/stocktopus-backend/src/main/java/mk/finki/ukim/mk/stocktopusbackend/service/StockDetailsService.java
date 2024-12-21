package mk.finki.ukim.mk.stocktopusbackend.service;

import mk.finki.ukim.mk.stocktopusbackend.model.StockDetails;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDetailsEditDTO;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.StockDetailsFilter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Collection;
import java.util.List;

public interface StockDetailsService {
    Page<StockDetails> findAll(Pageable pageable, StockDetailsFilter stockDetailsFilter);

    void deleteById(Long id);

    StockDetails editStockDetails(Long id, StockDetailsEditDTO stockDetailsDTO);
    List<StockDetails> getMostTraded();

    Page<StockDetails> findByStockId(Long stockId, Pageable pageable);

    List<StockDetails> findLatestByStockId(Long stockId);
}
