import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import Logo from './components/logo/Logo';
import Fondo from './components/fondo/Fondo';
import Robot from './components/robot/Robot';

import './components/logo/Logo.css';
import './components/navbar/Navbar.css';
import './components/robot/Robot.css';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div>
          <Fondo />
          <div className="menu-completo">
            <div className="Logo">
              <Logo />
            </div>
            <div className="navegacion">
              <Navbar />
            </div>
          </div>

          <div className="home">
            <div className="robot">
              {/* <Robot /> */}
            </div>
            <Routes>
              <Route path="/" element={<Home />} />
              {/* Agrega más rutas aquí según sea necesario */}
            </Routes>
          </div>
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
