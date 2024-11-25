import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/api'
    : 'https://ia-daryal-3.onrender.com/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

export const iniciarDiagnostico = async (datosVehiculo) => {
    try {
        const response = await apiClient.post('/iniciar-diagnostico', datosVehiculo);
        return response.data;
    } catch (error) {
        console.error("Error detallado:", error.response || error);
        throw error;
    }
};

export const continuarDiagnostico = async (historial, vehiculo) => {
    try {
        const response = await apiClient.post('/continuar-diagnostico', { historial, vehiculo });
        return response.data;
    } catch (error) {
        console.error("Error detallado:", error.response || error);
        throw error;
    }
};