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
import HeroGeometricBackground from './components/Herobackground/HeroGeometricBackground';
import './App.scss'
import Login from './components/Login/Login';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div>
          <HeroGeometricBackground />
          {/* <Fondo/> */}
        {/* <VideoBackground/> */}
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
                  {/* <Route path="/Login" element={<Login />} /> */}
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

// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from './firebase';
// import ErrorBoundary from './ErrorBoundary';
// import Navbar from './components/navbar/Navbar';
// import Home from './components/home/Home';
// import Logo from './components/logo/Logo';
// import Robot from './components/robot/Robot';
// import Lamp from './components/Lamp/Lamp';
// import CodeInterpreter from './components/CodeInterpreterForm/CodeInterpreter';
// import VideoBackground from './components/video/Video';
// import Login from './components/Login/Login';
// import Register from './components/Register/Register';
// import './components/logo/Logo.scss';
// import './components/navbar/Navbar.scss';
// import './components/robot/Robot.css';
// import './App.scss';
// import Fondo from './components/fondo/Fondo'

// function App() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   if (loading) {
//     return <div>Cargando...</div>;
//   }

//   return (
//     <Router>
//       <ErrorBoundary>
//         <div>
//           <Fondo />
//           <div className="menu-completo">
//             <div className="Logo">
//               <Logo />
//             </div>
//             <div className="navegacion">
//               <Navbar />
//             </div>
//           </div>

//           <div className="centro">
//             <div className="cuerpo">
//               <div className="robot">
//                 <Robot />
//               </div>
            
//               <div className="contenido">
//                 <Routes>
//                   <Route path="/login" element={<Login />} />
//                   <Route path="/register" element={<Register />} />
//                   <Route
//                     path="/"
//                     element={user && user.emailVerified ? <Home /> : <Navigate to="/login" />}
//                   />
//                   <Route
//                     path="/code"
//                     element={user && user.emailVerified ? <CodeInterpreter /> : <Navigate to="/login" />}
//                   />
//                 </Routes>
//               </div>
              
//             </div>
//             <div className="lamp">
//               <Lamp />
//             </div>
//           </div>
//         </div>
//       </ErrorBoundary>
//     </Router>
//   );
// }

// export default App;

