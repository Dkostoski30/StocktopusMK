import axiosInstance from '../config/axiosInstance.ts';
import config from "../config/config.ts";
import {StockIndicatorsDTO} from "../model/dto/stockIndicatorsDTO.ts";

const BASE_URL = config.API_BASE_URL;

export const findAll = async () : Promise<StockIndicatorsDTO[]> => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/stock-indicators`);
        return response.data;
    } catch (error) {
        console.error("Error fetching stock indicators:", error);
        throw error;
    }
};

export const findByStockId = async (id: number): Promise<StockIndicatorsDTO[]> => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/stock-indicators/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching stock indicators for stock ID ${id}:`, error);
        throw error;
    }
};