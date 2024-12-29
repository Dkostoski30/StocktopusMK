package mk.finki.ukim.mk.stocktopusbackend.model.dto;

import java.util.Date;

public interface StockDetailsProjection {
    String getStockName();
    Date getDate();
    String getMaxPrice();
    String getMinPrice();
    String getLastTransactionPrice();
}
