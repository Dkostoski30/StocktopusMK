package mk.finki.ukim.mk.stocktopusbackend.model.dto;

public record StockDetailsSortingConfig(String sortBy,
                                       String sortOrder) {
    public StockDetailsSortingConfig(String sortBy, String sortOrder) {
        this.sortBy = sortBy;
        this.sortOrder = sortOrder;
    }
}
