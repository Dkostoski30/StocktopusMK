export interface StockIndicatorsDTO {
    id: number;
    stockId: number;
    date: Date;
    sma50: number;
    ema50: number;
    rsi: number;
    macd: number;
    signalValue: number;
    decision: string;
}