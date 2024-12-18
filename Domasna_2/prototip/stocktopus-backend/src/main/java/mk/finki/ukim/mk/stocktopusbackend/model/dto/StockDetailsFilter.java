package mk.finki.ukim.mk.stocktopusbackend.model.dto;

public record StockDetailsFilter(String stockName,
                                 String dateFrom,
                                 String dateTo) {

    public StockDetailsFilter(String stockName, String dateFrom, String dateTo) {
        this.stockName = stockName != null ? stockName.toLowerCase() : null;
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
    }
}
