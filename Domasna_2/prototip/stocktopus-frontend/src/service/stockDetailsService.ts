import axios from 'axios';
import config from "../config/config.ts";
import {StockDetailsDTO} from "../model/dto/stockDetailsDTO.ts";
import {StockDetailsEditDTO} from "../model/dto/stockDetailsEditDTO.ts";

const BASE_URL = config.API_BASE_URL;

interface PaginationParams {
    page: number;
    size: number;
}

export const getItems = async ({ page, size, stockName, dateFrom, dateTo }: PaginationParams & {
    stockName?: string;
    dateFrom?: string;
    dateTo?: string;
}) => {
    try {
        const response = await axios.get<{
            totalElements: number;
            content: StockDetailsDTO[];
        }>(`${BASE_URL}/stock-details`, {
            params: {
                page,
                size,
                stockName,
                dateFrom,
                dateTo,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching stock details:', error);
        throw error;
    }
};

export const getStockDetailsByTicker = async (ticker: number) => {
    try {
        const response = await axios.get<StockDetailsDTO>(
            `${BASE_URL}/stock-details/${ticker}`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching stock details by ticker:', error);
        throw error;
    }
};

export const deleteStockDetails = async (id: number) => {
    try {
        await axios.delete(`${BASE_URL}/stock-details/${id}`);
    } catch (error) {
        console.error("Error deleting stock details:", error);
    }
};

export const editStockDetails = async (id: number, data: StockDetailsEditDTO) => {
    await axios.post(`${BASE_URL}/stock-details/edit/${id}`, data);

}

export const findLatestByStockId = async (stockId) => {
    try {
        const response = await axios.get(`${BASE_URL}/stock-details/latest/${stockId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching the latest stock details for stockId ${stockId}:`, error);
        throw error;
    }
};



