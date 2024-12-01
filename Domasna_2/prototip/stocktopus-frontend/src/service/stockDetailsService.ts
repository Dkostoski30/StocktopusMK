import axios from 'axios';
import config from "../config/config.ts";
import { StockDetailsDTO } from "../model/dto/stockDetailsDTO.ts";

const BASE_URL = config.API_BASE_URL;

interface PaginationParams {
    page: number;
    size: number;
}

export const getItems = async ({ page, size }: PaginationParams) => {
    try {
        const response = await axios.get<StockDetailsDTO[]>(`${BASE_URL}/stock-details`, {
            params: {
                page: page,
                size: size
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching stock details:", error);
        throw error;
    }
};
