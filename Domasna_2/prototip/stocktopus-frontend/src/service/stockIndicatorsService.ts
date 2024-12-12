import axios from 'axios';
import config from "../config/config.ts";
import {StockIndicatorsDTO} from "../model/dto/stockIndicatorsDTO.ts";

const BASE_URL = config.API_BASE_URL;

export const getAllStockIndicators = async () : Promise<StockIndicatorsDTO[]> => {
    try {
        const response = await axios.get(`${BASE_URL}/stock-indicators`);
        return response.data;
    } catch (error) {
        console.error("Error fetching stock indicators:", error);
        throw error;
    }
};