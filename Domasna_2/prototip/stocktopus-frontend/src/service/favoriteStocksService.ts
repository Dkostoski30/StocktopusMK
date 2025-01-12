import axiosInstance from '../config/axiosInstance';
import { StockDTO } from "../model/dto/stockDTO.ts";
import config from "../config/config.ts";
import {FavoriteStocksDTO} from "../model/dto/FavoriteStocksDTO.ts";
const BASE_URL = config.API_BASE_URL;
interface PaginationParams {
    page: number;
    size: number;
}

export const getFavoriteStocks = async ({ username, page, size }: { username: string } & PaginationParams) => {
    try {
        const response = await axiosInstance.get<{
            totalElements: number;
            content: StockDTO[];
        }>(`${BASE_URL}/favorite-stocks`, {
            params: {
                username,
                page,
                size
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching favorite stocks:", error);
        throw error;
    }
};
export const addFavoriteStock = async (data: FavoriteStocksDTO) => {
    await axiosInstance.post(`${BASE_URL}/favorite-stocks/add`, data);
};
export const removeFavoriteStock = async (data: FavoriteStocksDTO) => {
    await axiosInstance.delete(`${BASE_URL}/favorite-stocks/remove`, { data });
};
