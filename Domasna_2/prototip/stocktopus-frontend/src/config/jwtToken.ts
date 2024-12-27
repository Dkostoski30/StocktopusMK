import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
    roles: string[];
    sub: string;
    iat: number;
    exp: number;
}

export const getRolesFromToken = (): string[] => {
    const token = localStorage.getItem('token');
    if (!token) {
        return [];
    }
    try {
        const decoded: DecodedToken = jwtDecode(token);
        localStorage.setItem('roles', JSON.stringify(decoded.roles));
        return decoded.roles;
    } catch (error) {
        console.error('Invalid token', error);
        return [];
    }
};