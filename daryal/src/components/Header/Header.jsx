import React, { useState } from "react";

const Header = ({ onOBDClick, onManualClick, onHomeClick, showBack }) => {
  return (
    <header className="app-header">
      {showBack && (
        <button className="back-btn" onClick={onHomeClick}>
          <span className="icon">⬅️</span>
          <span>Volver</span>
        </button>
      )}
      {/* Las opciones de OBD y Ficha se han movido a la pantalla de bienvenida */}
    </header>
  );
};

export default Header;
