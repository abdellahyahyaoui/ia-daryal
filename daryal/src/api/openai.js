
import axios from 'axios';

// Configuración para desarrollo y producción
const API_URL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/api'
    : 'https://ia-daryal-3.onrender.com/api';

// Configurar axios con headers por defecto
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://darayal.web.app'
    }
});

export const iniciarDiagnostico = async (datosVehiculo) => {
    try {
        const response = await apiClient.post('/iniciar-diagnostico', datosVehiculo);
        return response.data;
    } catch (error) {
        console.error("Error detallado:", {
            mensaje: error.message,
            respuesta: error.response?.data,
            estado: error.response?.status,
            headers: error.response?.headers
        });
        throw error;
    }
};

export const continuarDiagnostico = async (historial, vehiculo) => {
    try {
        const response = await apiClient.post('/continuar-diagnostico', { historial, vehiculo });
        return response.data;
    } catch (error) {
        console.error("Error detallado:", {
            mensaje: error.message,
            respuesta: error.response?.data,
            estado: error.response?.status,
            headers: error.response?.headers
        });
        throw error;
    }
};
