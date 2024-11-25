import React, { useState } from 'react';
import CodeInterpreterForm from './CodeInterpreterForm';
import ResultadoDiagnostico from './ResultadoDiagnostico';
import { interpretarCodigos } from '../../api/openai';


const CodeInterpreter = () => {
    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(true);

    const handleSubmit = async (codigos) => {
        setError(null);
        setResultado(null);
        setIsLoading(true);

        try {
            const respuesta = await interpretarCodigos(codigos);
            setResultado(respuesta);
            setMostrarFormulario(false);
        } catch (err) {
            setError('Hubo un problema al interpretar los códigos. Por favor, inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const reiniciarFormulario = () => {
        setResultado(null);
        setError(null);
        setMostrarFormulario(true);
    };

    return (
        <div className="code-interpreter-container">
            {mostrarFormulario ? (
                <CodeInterpreterForm 
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    error={error}
                />
            ) : (
                <div className="resultado-container">
                    <ResultadoDiagnostico resultado={resultado} />
                    <button onClick={reiniciarFormulario} className="reset-button">
                        Interpretar Nuevos Códigos
                    </button>
                </div>
            )}
        </div>
    );
};

export default CodeInterpreter;

