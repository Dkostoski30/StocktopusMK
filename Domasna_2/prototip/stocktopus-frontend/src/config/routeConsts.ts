export const USER_ROUTES = {
    DASHBOARD: '/',
    HISTORIC_DATA: '/user/*',
    LOGIN: '/login',
    REGISTER: '/register',
    ALL_STOCKS: '/user/stocks',
    STOCK_DETAILS: '/stock-details/:ticker',
    PREDICTOR: '/predictor',
    // PREDICTOR_BY_STOCK: '/predictor/:stockId',
    FAVORITES: '/favorites',
};

export const ADMIN_ROUTES = {
    HISTORIC_DATA: '/admin/stockDetails',
    ALL_STOCKS: '/admin/stocks',
    USERS: '/admin/users',
    LOGIN: '/login',
    REGISTER: '/register',
    PREDICTOR: '/predictor',
    // PREDICTOR_BY_STOCK: '/predictor/:stockId',
    FAVORITES: '/favorites',
    DASHBOARD: '/',
};