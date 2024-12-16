import axios from 'axios';
import config from "../config/config.ts";
import {StockDetailsDTO} from "../model/dto/stockDetailsDTO.ts";
import {SetStateAction} from "react";
import {StockDetailsEditDTO} from "../model/dto/stockDetailsEditDTO.ts";

const BASE_URL = config.API_BASE_URL;

interface PaginationParams {
    page: number;
    size: number;
}

export const getItems = async ({page, size}: PaginationParams) => {
    try {
        const response = await axios.get<{
            totalElements: SetStateAction<number>; content: StockDetailsDTO[]
        }>(`${BASE_URL}/stock-details`, {
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

export const deleteStockDetails = async (id: number) => {
    try {
        await axios.delete(`${BASE_URL}/stock-details/${id}`);
    } catch (error) {
        console.error("Error deleting stock details:", error);
    }
};

export const editStockDetails = async (id: number, data: StockDetailsEditDTO) => {
    await axios.post(`${BASE_URL}/stock-details/edit/${id}`, data);

}