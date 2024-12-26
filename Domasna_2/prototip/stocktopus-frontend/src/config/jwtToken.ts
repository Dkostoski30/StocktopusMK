import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
    roles: string[];
    sub: string;
    iat: number;
    exp: number;
}

export const getRolesFromToken = (): string[] => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (!token) {
        console.error('Token not found');
        return [];
    }

    try {
        const decoded: DecodedToken = jwtDecode(token);
        return decoded.roles;
    } catch (error) {
        console.error('Invalid token', error);
        return [];
    }
};