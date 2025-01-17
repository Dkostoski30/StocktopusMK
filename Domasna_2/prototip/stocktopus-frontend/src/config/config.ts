import dotenv from 'dotenv';
dotenv.config();

const config = {
    API_BASE_URL: `http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/api`,
    PYTHON_BASE_URL: `http://${process.env.PREDICTOR_HOST}:${process.env.PREDICTOR_PORT}`,
};

export default config;