const config = {
    API_BASE_URL: `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api`,
    PYTHON_BASE_URL: `http://${import.meta.env.VITE_PREDICTOR_HOST}:${import.meta.env.VITE_PREDICTOR_PORT}`,
};
console.log("API_BASE_URL:", import.meta.env.VITE_BACKEND_HOST);
console.log("PYTHON_BASE_URL:", import.meta.env.VITE_PREDICTOR_HOST);
export default config;