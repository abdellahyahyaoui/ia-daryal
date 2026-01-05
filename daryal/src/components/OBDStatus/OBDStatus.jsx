import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Capacitor } from '@capacitor/core';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import './OBDStatus.scss';

const OBDStatus = ({ onClose }) => {
    const [step, setStep] = useState('search'); // search, found, connecting, connected
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [testMode, setTestMode] = useState(false);
    const [chartData, setChartData] = useState([]);

    /* =========================
       INICIALIZAR BLUETOOTH
    ========================= */
    useEffect(() => {
        if (Capacitor.isNativePlatform()) {
            BleClient.initialize();
        }
    }, []);

    /* =========================
       ACTUALIZAR GRÁFICAS
    ========================= */
    useEffect(() => {
        if (step === 'connected' && data) {
            const interval = setInterval(() => {
                setChartData(prev => {
                    const newPoint = {
                        name: prev.length.toString(),
                        rpm: typeof data.rpm === 'number' ? data.rpm : parseInt(data.rpm) || 0,
                        temp: parseInt(data.temp) || 0,
                        voltage: parseFloat(data.voltage) || 0
                    };
                    return [...prev.slice(-19), newPoint];
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [step, data]);

    const getApiUrl = (path) => {
        const domain = window.location.hostname;
        if (domain === 'localhost' || domain === '127.0.0.1') {
            return `http://localhost:8000${path}`;
        }
        return `https://ia-daryal-3.onrender.com${path}`;
    };

    /* =========================
       REEMPLAZO: BUSCAR Y CONECTAR OBD REAL
    ========================= */
    const startSearch = async () => {
        setLoading(true);
        setError(null);

        try {
            if (Capacitor.isNativePlatform()) {
                // BLE real en APK
                await BleClient.requestLEScan({}, (device) => {
                    if (device.name?.toLowerCase().includes('obd')) {
                        BleClient.stopLEScan();
                        connectToDevice(device);
                    }
                });

                setTimeout(() => BleClient.stopLEScan(), 10000);
            } else {
                // Web / fallback
                throw new Error('Bluetooth no soportado en este navegador');
            }
        } catch (err) {
            console.error(err);
            setError('No se pudo encontrar el adaptador OBD-II. Asegúrate de que el Bluetooth esté activo y el aparato conectado al coche.');
            setStep('found');
        } finally {
            setLoading(false);
        }
    };

    const connectToDevice = async (device) => {
        setSelectedDevice(device);
        setStep('connecting');
        setError(null);
        setTestMode(false);

        try {
            if (Capacitor.isNativePlatform()) {
                await BleClient.connect(device.deviceId);
                setStep('connected');

                // Obtener datos desde backend
                const response = await axios.get(getApiUrl('/api/obd-data'));
                setData(response.data);
            }
        } catch (err) {
            console.error(err);
            setError('Error al conectar con el dispositivo');
            setStep('found');
        }
    };

    const handleTestMode = () => {
        setTestMode(true);
        const mockData = {
            status: "connected",
            mock: true,
            dtc: ["P0300", "P0171"],
            rpm: 2500,
            temp: "95 C",
            load: "45 %",
            voltage: "13.8 V",
            throttle: "25 %",
            fuel_level: "60 %",
            marca: "Test-Brand",
            modelo: "Simulator",
            año: "2024"
        };
        setData(mockData);
        setStep('connected');
    };

    useEffect(() => {
        if (step === 'search') startSearch();
    }, []);

    /* =========================
       CHARTS Y RENDER
    ========================= */
    const renderCharts = () => (
        <div className="obd-charts-professional">
            <div className="chart-container">
                <h4>Revoluciones (RPM)</h4>
                <div style={{ width: '100%', height: 200 }}>
                    <ResponsiveContainer>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorRpm" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#444" />
                            <XAxis dataKey="name" hide />
                            <YAxis domain={[0, 8000]} stroke="#888" />
                            <Tooltip contentStyle={{ backgroundColor: '#222', border: 'none' }} />
                            <Area type="monotone" dataKey="rpm" stroke="#8884d8" fillOpacity={1} fill="url(#colorRpm)" animationDuration={300} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="chart-container">
                <h4>Voltaje Batería</h4>
                <div style={{ width: '100%', height: 200 }}>
                    <ResponsiveContainer>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorVoltage" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#444" />
                            <XAxis dataKey="name" hide />
                            <YAxis domain={[10, 16]} stroke="#888" />
                            <Tooltip contentStyle={{ backgroundColor: '#222', border: 'none' }} />
                            <Area type="monotone" dataKey="voltage" stroke="#82ca9d" fillOpacity={1} fill="url(#colorVoltage)" animationDuration={300} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content obd-modal" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                
                <div className="modal-header">
                    <h2> Conexión OBD-II Bluetooth</h2>
                </div>

                <div className="modal-body">
                    {step === 'search' && (
                        <div className="searching">
                            <div className="spinner"></div>
                            <p>Listo para buscar adaptadores Bluetooth...</p>
                            <button className="scan-btn" onClick={startSearch}>Buscar Adaptador Real</button>
                        </div>
                    )}

                    {step === 'found' && (
                        <div className="direct-connect">
                            <p>Opciones de conexión:</p>
                            <div className="adapter-info" onClick={startSearch} style={{cursor: 'pointer'}}>
                                <span className="name">Daryal-OBD-Adapter (Hardware)</span>
                            </div>
                            <button className="retry-btn" onClick={startSearch}>Volver a buscar hardware</button>
                        </div>
                    )}

                    {step === 'connecting' && (
                        <div className="connecting">
                            <div className="spinner"></div>
                            <p>Conectando con {selectedDevice?.name}...</p>
                            <p className="sub">Estableciendo comunicación con la ECU del vehículo</p>
                        </div>
                    )}

                    {step === 'connected' && data && (
                        <div className="connected-view">
                            <div className="success-badge">✅ Conectado</div>
                            
                            {renderCharts()}

                            <div className="data-display">
                                <div className="data-card">
                                    <span className="label">RPM</span>
                                    <span className="value">{data.rpm}</span>
                                </div>
                                <div className="data-card">
                                    <span className="label">Temp Motor</span>
                                    <span className="value">{data.temp}</span>
                                </div>
                                <div className="data-card">
                                    <span className="label">Carga Motor</span>
                                    <span className="value">{data.load}</span>
                                </div>
                                <div className="data-card">
                                    <span className="label">Voltaje</span>
                                    <span className="value">{data.voltage}</span>
                                </div>
                                <div className="data-card">
                                    <span className="label">Mariposa (TPS)</span>
                                    <span className="value">{data.throttle}</span>
                                </div>
                                <div className="data-card">
                                    <span className="label">Nivel Fuel</span>
                                    <span className="value">{data.fuel_level}</span>
                                </div>
                                <div className="data-card full-width">
                                    <span className="label">Códigos de Error (DTC)</span>
                                    <span className="value dtc-list">
                                        {data.dtc.length > 0 ? data.dtc.join(', ') : 'Sistema limpio'}
                                    </span>
                                </div>
                            </div>
                            
                            {data.dtc.length > 0 && (
                                <button className="clear-btn" onClick={async () => {
                                    try {
                                        await axios.post(getApiUrl('/api/clear-errors'));
                                        alert('Códigos borrados correctamente');
                                        const response = await axios.get(getApiUrl('/api/obd-data'));
                                        setData(response.data);
                                    } catch (err) {
                                        alert('Error al borrar códigos');
                                    }
                                }}>
                                     Borrar Errores DTC
                                </button>
                            )}
                            
                            <button className="confirm-btn" onClick={() => onClose(data)}>Analizar con IA</button>
                        </div>
                    )}
                    
                    {error && <p className="error-msg">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default OBDStatus;
