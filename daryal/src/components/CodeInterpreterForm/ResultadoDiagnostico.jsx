import React from 'react';

const ResultadoDiagnostico = ({ resultado }) => {
  if (!resultado) return null;

  return (
    <div className="resultado">
      <h2 className="resultado-titulo">Resultado del Diagnóstico</h2>
      <h3 className="resultado-subtitulo">Diagnóstico</h3>
      <p className="resultado-diagnostico">{resultado.diagnostico}</p>
      <h3 className="resultado-subtitulo">Sugerencias</h3>
      <ul className="resultado-sugerencias">
        {resultado.sugerencias.map((sugerencia, index) => (
          <li key={index} className="resultado-sugerencia">{sugerencia}</li>
        ))}
      </ul>
    </div>
  );
};

export default ResultadoDiagnostico;

