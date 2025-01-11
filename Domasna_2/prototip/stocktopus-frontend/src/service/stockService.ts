import { StockDTO } from "../model/dto/stockDTO.ts";
import config from "../config/config.ts";
import axiosInstance from "../config/axiosInstance.ts";
const BASE_URL = config.API_BASE_URL;

interface PaginationParams {
    page: number;
    size: number;
}

export const findAll = async ({ page, size, stockName }: PaginationParams & { stockName?: string }) => {
    try {
        const response = await axiosInstance.get<{
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


export const deleteStock = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`${BASE_URL}/stocks/${id}`);
        if (response.status !== 200) {
            throw new Error('Failed to delete item');
        }
    }finally {
        console.log()
    }
};

export const editStock = async (id: number, data: StockDTO) => {

    await axiosInstance.post(`${BASE_URL}/stocks/edit/${id}`, data);

}

export const findBestFour = async () => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/stocks/getBestFour`);
        return response.data;
    } catch (error) {
        console.error("Error fetching the best four stocks:", error);
        throw error;
    }
};

export const getStockDTOById = async (id: number): Promise<StockDTO> => {
    try {
        const response = await axiosInstance.get<StockDTO>(`${BASE_URL}/stocks/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching stock with ID ${id}:`, error);
        throw error;
    }
};