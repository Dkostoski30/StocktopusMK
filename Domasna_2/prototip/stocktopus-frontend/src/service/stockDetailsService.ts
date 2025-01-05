import axiosInstance from '../config/axiosInstance';
import config from "../config/config.ts";
import {StockDetailsDTO} from "../model/dto/stockDetailsDTO.ts";
import {StockDetailsEditDTO} from "../model/dto/stockDetailsEditDTO.ts";

const BASE_URL = config.API_BASE_URL;
const PYTHON_BASE_URL = config.PYTHON_BASE_URL;
interface PaginationParams {
    page: number;
    size: number;
}

export const findAll = async ({ page, size, stockName, dateFrom, dateTo, sortBy, sortOrder }: PaginationParams & {
    stockName?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: string;
}) => {
    try {
        const response = await axiosInstance.get<{
            totalElements: number;
            content: StockDetailsDTO[];
        }>(`${BASE_URL}/stock-details`, {
            params: {
                page,
                size,
                stockName,
                dateFrom,
                dateTo,
                sortBy,
                sortOrder
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching stock details:', error);
        throw error;
    }
};
export const getPrediction = async (tickerId: number) => {
    try {
        const response = await axiosInstance.get(`${PYTHON_BASE_URL}/predict/${tickerId}`);
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error(`Error fetching prediction for ticker ID ${tickerId}:`, error);

        return {
            success: false,
            status: null,
            message: "Unable to connect to the server",
        };
    }
};

export const deleteStockDetails = async (id: number) => {
    try {
        await axiosInstance.delete(`${BASE_URL}/stock-details/${id}`);
    } catch (error) {
        console.error("Error deleting stock details:", error);
    }
};

export const editStockDetails = async (id: number, data: StockDetailsEditDTO) => {
    await axiosInstance.post(`${BASE_URL}/stock-details/edit/${id}`, data);

}

export const findLatestByStockId = async (stockId : number | string) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/stock-details/latest/${stockId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching the latest stock details for stockId ${stockId}:`, error);
        throw error;
    }
};

export const exportMostTraded = async () => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/stock-details/exportMostTraded`, {
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.download = "most_traded_stocks.csv";
        link.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error exporting CSV:", error);
    }
};

// export const getStockDetailsByTicker = async (ticker: number) => {
//     try {
//         const response = await axiosInstance.get<StockDetailsDTO>(
//             `${BASE_URL}/stock-details/${ticker}`
//         );
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching stock details by ticker:', error);
//         throw error;
//     }
// }; // TODO: Remove if not needed

