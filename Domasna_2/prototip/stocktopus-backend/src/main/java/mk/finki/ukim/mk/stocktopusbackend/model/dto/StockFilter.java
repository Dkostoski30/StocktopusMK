package mk.finki.ukim.mk.stocktopusbackend.model.dto;

public record StockFilter(String stockName) {

    public StockFilter(String stockName) {
        this.stockName = stockName != null ? stockName.toLowerCase() : null;
    }
}
