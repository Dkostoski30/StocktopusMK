import axios from 'axios';
import config from "../config/config.ts";
import {StockDetailsDTO} from "../model/dto/stockDetailsDTO.ts";

const BASE_URL = config.API_BASE_URL;

export const getItems = async () => {
    const response = await axios.get<StockDetailsDTO[]>(`${BASE_URL}/stock-details`);
    return response.data;
};