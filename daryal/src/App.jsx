import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import Logo from './components/logo/Logo';
import Fondo from './components/fondo/Fondo';
import Robot from './components/robot/Robot';
import Lamp from './components/Lamp/Lamp';
import CodeInterpreterPage from './components/CodeInterpreterPage/CodeInterpreterForm';

import './components/logo/Logo.css';
import './components/navbar/Navbar.css';
import './components/robot/Robot.css';

import './App.css'
function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div>253
          {/* <Fondo /> */}
          <div className="menu-completo">
            <div className="Logo">
              <Logo />
            </div>
            <div className="navegacion">
              <Navbar />
            </div>
          </div>

          <div className="centro">
            <div className="cuerpo">
            <div className="robot">
              <Robot />
            </div>
            
            <div className="contenido">
            <Routes>
              <Route path="/" element={<Home />} />
                  {/* Agrega más rutas aquí según sea necesario */}
                  <Route path="/code" element={<CodeInterpreterPage />} />
            </Routes>
              </div>
              </div>
            <div className="lamp">
              <Lamp />
              
            </div>
              
          </div>
          
         
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
