// import React, { useState } from 'react';
// // import { interpretarCodigos } from '../../api/openai'; // Importa tu función de API
// import './CodeInterpreterForm.scss';

// const CodeInterpreterForm = () => {
//     const [codigos, setCodigos] = useState('');
//     const [resultado, setResultado] = useState(null);
//     const [error, setError] = useState(null);

//     const manejarCambio = (e) => {
//         setCodigos(e.target.value);
//     };

//     const manejarSubmit = async (e) => {
//   e.preventDefault();
//   setError(null);

//   try {
//     const listaCodigos = codigos.split(',').map((codigo) => codigo.trim());
//     const respuesta = await interpretarCodigos(listaCodigos);
//     setResultado(respuesta.interpretacion);
//   } catch (err) {
//     setError('Hubo un problema al interpretar los códigos. Por favor, inténtalo de nuevo.');
//   }
// };

//     return (
//         <div className="code-interpreter-form">
//             <form onSubmit={manejarSubmit}>
//                 <label htmlFor="codigos">Introduce los códigos de error (separados por comas):</label>
//                 <input
//                     id="codigos"
//                     type="text"
//                     value={codigos}
//                     onChange={manejarCambio}
//                     placeholder="P1234, C5678"
//                     required
//                 />
//                 <button type="submit">Interpretar Códigos</button>
//             </form>

//             {error && <p className="error">{error}</p>}
//             {resultado && (
//                 <div className="resultado">
//                     <h2>Diagnóstico</h2>
//                     <p>{resultado.diagnostico}</p>
//                     <h3>Sugerencias</h3>
//                     <ul>
//                         {resultado.sugerencias.map((sugerencia, index) => (
//                             <li key={index}>{sugerencia}</li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default CodeInterpreterForm;
