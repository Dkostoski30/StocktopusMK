export interface StockDetailsDTO {
    detailsId: number;
    stockId: number;
    stockName: string;
    date: Date;
    lastTransactionPrice: string;
    maxPrice: string;
    minPrice: string;
    averagePrice: string;
    percentageChange: string;
    quantity: string;
    tradeVolume: string;
    totalVolume: string;
}