import React from 'react';
import { Navigate } from 'react-router-dom';
import {getRolesFromToken} from "./jwtToken.ts";

interface AuthRouteAdminProps {
    children: React.ReactNode;
}

const AuthRouteAdmin: React.FC<AuthRouteAdminProps> = ({ children }) => {
    const isAdmin = getRolesFromToken().includes('ROLE_ADMIN');

    return isAdmin ? <>{children}</> : <Navigate to="/login" />;
};

export default AuthRouteAdmin;