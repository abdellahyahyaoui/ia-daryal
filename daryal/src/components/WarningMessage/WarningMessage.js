import React from 'react';
import './WarningMessage.scss';

function WarningMessage({ message, onClose }) {
    if (!message) return null; // No renderizar si no hay mensaje

    return (
        <div className="warning-message">
            <p>{message}</p>
            {onClose && (
                <button  onClick={onClose}>
                    Cerrar
                </button>
            )}
        </div>
    );
}

export default WarningMessage;
