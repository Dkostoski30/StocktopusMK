import axios from 'axios';
import { StockDTO } from "../model/dto/stockDTO.ts";
import config from "../config/config.ts";
const BASE_URL = config.API_BASE_URL;

interface PaginationParams {
    page: number;
    size: number;
}

export const getItems = async ({ page, size, stockName }: PaginationParams & { stockName?: string }) => {
    try {
        const response = await axios.get<{
            totalElements: number;
            content: StockDTO[];
        }>(`${BASE_URL}/stocks`, {
            params: {
                page,
                size,
                stockName
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching stocks:", error);
        throw error;
    }
};


export const deleteItem = async (id: number) => {
    try {
        const response = await axios.delete(`${BASE_URL}/stocks/${id}`);
        if (response.status !== 200) {
            throw new Error('Failed to delete item');
        }
    }finally {
        console.log()
    }
};

export const editItem = async (id: number, data: StockDTO) => {
    await axios.post(`${BASE_URL}/stocks/edit/${id}`, data);

}

export const getBestFourStocks = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/stocks/getBestFour`);
        return response.data; // This will contain the list of StockPercentageDTO
    } catch (error) {
        console.error("Error fetching the best four stocks:", error);
        throw error; // Optionally re-throw the error to handle it elsewhere
    }
};