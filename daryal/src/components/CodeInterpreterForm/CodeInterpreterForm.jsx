import React, { useState } from 'react';
import './CodeInterpreterForm.scss';

const CodeInterpreterForm = ({ onSubmit, isLoading, error }) => {
    const [codigos, setCodigos] = useState(['', '', '', '']);

    const codigoValidoRegex = /^[PCBU][01]\d{3}$/;

    const manejarCambioCodigo = (index, value) => {
        if (value.length <= 5 && /^[A-Za-z0-9]*$/.test(value)) {
            const nuevosCodigos = [...codigos];
            nuevosCodigos[index] = value.toUpperCase();
            setCodigos(nuevosCodigos);
        }
    };

    const manejarSubmit = (e) => {
        e.preventDefault();
        const codigosFiltrados = codigos.filter(codigo => codigo.trim() !== '');
        if (codigosFiltrados.length === 0) {
            alert('Debes ingresar al menos un código.');
            return;
        }
        if (!codigosFiltrados.every(codigo => codigoValidoRegex.test(codigo))) {
            alert('Todos los códigos deben ser válidos (ejemplo: P0123, C1234).');
            return;
        }
        onSubmit(codigosFiltrados);
    };

    return (
        <form className="code-interpreter-form" onSubmit={manejarSubmit}>
            <h2 className="form-title">Intérprete de Códigos de Error</h2>
            <div className="codigos-container">
                {codigos.map((codigo, index) => (
                    <div key={index} className="form-group">
                        <input
                            type="text"
                            value={codigo}
                            onChange={(e) => manejarCambioCodigo(index, e.target.value)}
                            placeholder={`Código ${index + 1}`}
                            required={index === 0}
                            className="form-input"
                        />
                        {!codigoValidoRegex.test(codigo) && codigo.trim() !== '' && (
                            <p className="error">Código inválido</p>
                        )}
                    </div>
                ))}
            </div>
            <button type="submit" disabled={isLoading} className="submit-button">
                {isLoading ? 'Interpretando...' : 'Interpretar Códigos'}
            </button>
            {error && <p className="error">{error}</p>}
        </form>
    );
};

export default CodeInterpreterForm;
