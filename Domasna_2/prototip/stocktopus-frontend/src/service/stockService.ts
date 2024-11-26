import axios from 'axios';
import {StockDTO} from "../model/dto/stockDTO.ts";
import config from "../config/config.ts";

const BASE_URL = config.API_BASE_URL;

export const getItems = async () => {
    const response = await axios.get<StockDTO[]>(`${BASE_URL}/stocks`);
    return response.data;
};