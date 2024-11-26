package mk.finki.ukim.mk.stocktopusbackend.service;

import mk.finki.ukim.mk.stocktopusbackend.model.StockDetails;

import java.util.List;

public interface StockDetailsService {
    List<StockDetails> findAll();
}
