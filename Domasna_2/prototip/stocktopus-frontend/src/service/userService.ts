import config from "../config/config.ts";
import axiosInstance from "../config/axiosInstance.ts"
import {UserDTO} from "../model/dto/UserDTO.ts";
import {UserLoginDTO} from "../model/dto/UserLoginDTO.ts";
import {getRolesFromToken} from "../config/jwtToken.ts";
import {UserDetailsDTO} from "../model/dto/UserDetailsDTO.ts";

const BASE_URL = config.API_BASE_URL;

export const register = async (userDTO : UserDTO) => {
    await axiosInstance.post(`${BASE_URL}/register`, userDTO);
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
        const response = await axiosInstance.post(`${BASE_URL}/login`, userLoginDTO);

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

interface PaginationParams {
    page: number;
    size: number;
}

interface UserFilterParams {
    username?: string;
    email?: string;
    role?: string;
}

interface UserResponse {
    totalElements: number;
    content: UserDetailsDTO[];
}
export const deleteUserByUsername = async (username: string): Promise<void> => {
    try {
        await axiosInstance.delete(`${BASE_URL}/users/delete/${username}`);
        console.log(`User with username "${username}" successfully deleted.`);
    } catch (error) {
        console.error(`Error deleting user with username "${username}":`, error);
        throw error;
    }
};
export const fetchAllUsers = async (
    { page, size }: PaginationParams,
    { username, email, role }: UserFilterParams = {}
): Promise<UserResponse> => {
    try {
        const response = await axiosInstance.get<UserResponse>(`${BASE_URL}/users`, {
            params: {
                page,
                size,
                username,
                email,
                role,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};
