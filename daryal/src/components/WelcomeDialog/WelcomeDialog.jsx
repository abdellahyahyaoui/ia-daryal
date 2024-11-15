import React from 'react';
import './WelcomeDialog.scss';

function WelcomeDialog({ onStart }) {
  return (
    <div className="welcome-dialog">
      <h1>Bienvenido al Diagnóstico Futurista de Vehículos</h1>
      {/* <p>Embárcate en un viaje de diagnóstico avanzado. Responde algunas preguntas sobre tu vehículo y te proporcionaremos un análisis de última generación.</p> */}
      <ul>
        <li>Diagnóstico rápido y preciso</li>
        <li>Recomendaciones personalizadas</li>
        <li>Ahorro de tiempo y dinero</li>
        <li>Prevención de problemas mayores</li>
      </ul>
      <button onClick={onStart}>Iniciar Diagnóstico</button>
    </div>
  );
}

export default WelcomeDialog;