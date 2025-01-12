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

export const getUsernameFromToken = (): string => {
    const token = localStorage.getItem('token');
    if (!token) {
        return "";
    }
    try {
        const decoded: DecodedToken = jwtDecode(token);
        return decoded.sub;
    } catch (error) {
        console.error('Invalid token', error);
        return "";
    }
};

export const isUser = (): boolean => {
    const roles = getRolesFromToken();
    return roles.includes("ROLE_USER");
};

export const isAdmin = (): boolean => {
    const roles = getRolesFromToken();
    return roles.includes('ROLE_ADMIN')
};
