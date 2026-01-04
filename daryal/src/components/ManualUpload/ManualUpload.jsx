import React, { useState } from 'react';
import axios from 'axios';
import './ManualUpload.scss';

const TechnicalSheetUpload = ({ onExtractionSuccess, onClose }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setMessage('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const domain = window.location.hostname;
            const apiUrl = domain === 'localhost' || domain === '127.0.0.1' 
                ? 'http://localhost:8000/api' 
                : '/api';

            const response = await axios.post(`${apiUrl}/extract-tech-sheet`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage('Ficha técnica procesada. Datos del vehículo extraídos correctamente.');
            if (onExtractionSuccess) onExtractionSuccess(response.data.specs);
            setTimeout(onClose, 2000);
        } catch (err) {
            setMessage('Error al procesar la ficha técnica');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content manual-modal" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                
                <div className="modal-header">
                    <h2>📄 Ficha Técnica del Vehículo</h2>
                    <p>Sube la ficha técnica para identificación y especificaciones automáticas</p>
                </div>

                <div className="modal-body">
                    <div className="upload-zone">
                        <input type="file" id="file-input" accept=".pdf,image/*" onChange={handleFileChange} hidden />
                        <label htmlFor="file-input" className="file-label">
                            <span className="icon">📄</span>
                            <span className="text">{file ? file.name : 'Seleccionar Ficha (PDF o Imagen)'}</span>
                        </label>
                        
                        <button className="upload-btn" onClick={handleUpload} disabled={!file || uploading}>
                            {uploading ? 'Extrayendo datos...' : 'Procesar Ficha'}
                        </button>
                    </div>
                    {message && <p className={`status-msg ${message.includes('Error') ? 'error' : 'success'}`}>{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default TechnicalSheetUpload;
