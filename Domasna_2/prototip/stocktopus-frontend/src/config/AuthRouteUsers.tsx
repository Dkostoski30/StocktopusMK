import React from 'react';
import { Navigate } from 'react-router-dom';

interface AuthRouteProps {
    children: React.ReactNode;
}

const AuthRouteUsers: React.FC<AuthRouteProps> = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('token');

    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default AuthRouteUsers;