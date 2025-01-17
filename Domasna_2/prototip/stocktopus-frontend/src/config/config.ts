import dotenv from 'dotenv';
dotenv.config();

const config = {
    API_BASE_URL: `http://${import.meta.env.BACKEND_HOST}:${import.meta.env.BACKEND_PORT}/api`,
    PYTHON_BASE_URL: `http://${import.meta.env.PREDICTOR_HOST}:${import.meta.env.PREDICTOR_PORT}`,
};

export default config;