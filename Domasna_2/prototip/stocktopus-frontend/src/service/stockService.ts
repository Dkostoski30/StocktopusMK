import axios from 'axios';
import {StockDTO} from "../model/dto/stockDTO.ts";

const API_URL = 'http://localhost:8080/api/stocks';

export const getItems = async () => {
    const response = await axios.get<StockDTO[]>(API_URL);
    return response.data;
};