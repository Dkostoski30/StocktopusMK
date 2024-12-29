package mk.finki.ukim.mk.stocktopusbackend.model.dto;

import java.util.Date;

public interface StockDetailsProjection {
    Long getDetailsId();
    Long getStockId();
    String getStockName();
    Date getDate();
    String getLastTransactionPrice();
    String getMaxPrice();
    String getMinPrice();
    String getAveragePrice();
    String getPercentageChange();
    String getQuantity();
    String getTradeVolume();
    String getTotalVolume();
}
