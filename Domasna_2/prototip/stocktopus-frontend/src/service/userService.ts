import config from "../config/config.ts";
import axios from "axios";
import {UserDTO} from "../model/dto/UserDTO.ts";
import {UserLoginDTO} from "../model/dto/UserLoginDTO.ts";
import {getRolesFromToken} from "../config/jwtToken.ts";

const BASE_URL = config.API_BASE_URL;

export const register = async (userDTO : UserDTO) => {
    await axios.post(`${BASE_URL}/register`, userDTO);
}


export const fetchTokenFromHeader = async (response: any): Promise<string | null> => {
    const authorizationHeader = response.headers['authorization'];
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        return authorizationHeader.substring(7);
    }
    return null;
};

export const login = async (userLoginDTO: UserLoginDTO): Promise<string | null> => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, userLoginDTO);

        const token = await fetchTokenFromHeader(response);

        if (token) {
            localStorage.setItem('token', token);
            getRolesFromToken();
        }
    } catch (error) {
        console.error('Login failed:', error);
        throw new Error('Login failed');
    }
    return null;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
};


// Fetch users with pagination and filtering
export const getUsers = async (params: { page: number; size: number; username?: string }) => {
    try {
        const response = await axios.get(`${BASE_URL}/users`, { params });
        return response.data; // Assuming the API response contains { content: [], totalElements: number }
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

// Delete a user by username
export const deleteUser = async (username: string) => {
    try {
        const response = await axios.delete(`${BASE_URL}/users/${username}`);
        return response.data; // Adjust based on your API response
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};
