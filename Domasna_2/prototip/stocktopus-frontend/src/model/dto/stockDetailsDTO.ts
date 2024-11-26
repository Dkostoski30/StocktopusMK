export interface StockDetailsDTO {
    id: string;
    stockId: number;
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