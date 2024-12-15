import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import Logo from './components/logo/Logo';
import Fondo from './components/fondo/Fondo';
import Robot from './components/robot/Robot';
import Lamp from './components/Lamp/Lamp';
import CodeInterpreter from './components/CodeInterpreterForm/CodeInterpreter';
import VideoBackground  from './components/video/Video';
import './components/logo/Logo.scss';
import './components/navbar/Navbar.scss';
import './components/robot/Robot.css';

import './App.scss'

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div>
          {/* <Fondo/> */}
        <VideoBackground/>
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
                  <Route path="/code" element={<CodeInterpreter />} />
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

