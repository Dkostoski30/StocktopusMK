import axios from 'axios';
import { StockDTO } from "../model/dto/stockDTO.ts";
import config from "../config/config.ts";

const BASE_URL = config.API_BASE_URL;

interface PaginationParams {
    page: number;
    size: number;
}

export const getItems = async ({ page, size }: PaginationParams) => {
    try {
        const response = await axios.get<{ content: StockDTO[] }>(`${BASE_URL}/stocks`, {
            params: {
                page: page,
                size: size
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching stocks:", error);
        throw error;
    }
};
