import config from "../config/config.ts";
import axios from "axios";
import {UserDTO} from "../model/dto/UserDTO.ts";
import {UserLoginDTO} from "../model/dto/UserLoginDTO.ts";

const BASE_URL = config.API_BASE_URL;

// interface PaginationParams {
//     page: number;
//     size: number;
// }

export const register = async (userDTO : UserDTO) => {
    await axios.post(`${BASE_URL}/register`, userDTO);
}

export const login = async (userLoginDTO : UserLoginDTO) => {
    await axios.post(`${BASE_URL}/login`, userLoginDTO);
}

export const logout = async () => {
    await axios.post(`${BASE_URL}/logout`);
}