export interface StockIndicatorsDTO {
    id: number;
    stockId: number;
    date: Date;
    timeframe: string;
    sma50: number;
    sma200: number;
    ema50: number;
    ema200: number;
    rsi: number;
    macd: number;
    stochasticOscillator: number;
    cci: number;
    williamsR: number;
    bollingerHigh: number;
    bollingerLow: number;
    signal: string;
}