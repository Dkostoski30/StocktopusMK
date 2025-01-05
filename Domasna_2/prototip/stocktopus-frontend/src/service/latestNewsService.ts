import axiosInstance from '../config/axiosInstance';
import config from '../config/config.ts';
import {LatestNewsDTO} from "../model/dto/latestNewsDTO.ts";

const BASE_URL = config.API_BASE_URL;

interface PaginationParams {
    page: number;
    size: number;
}

export const getLatestNewsByStockId = async ({
                                                 page,
                                                 size,
                                                 stockId,
                                             }: PaginationParams & { stockId: number }): Promise<{
    totalElements: number;
    content: LatestNewsDTO[];
}> => {
    try {
        const response = await axiosInstance.get<{
            totalElements: number;
            content: LatestNewsDTO[];
        }>(`${BASE_URL}/latest-news/latestByStock/${stockId}`, {
            params: {
                page,
                size,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching latest news for stock ID ${stockId}:`, error);
        throw error;
    }
};
