
import React, { useState, useReducer } from 'react';
import WelcomeDialog from '../WelcomeDialog/WelcomeDialog';
import VehicleForm from '../VehicleForm/VehicleForm';
import QuestionForm from '../QuestionForm/QuestionForm';
import Diagnosis from '../Diagnosis/Diagnosis';
import WarningMessage from '../WarningMessage/WarningMessage'; // Importamos el nuevo componente
import { iniciarDiagnostico, continuarDiagnostico } from '../../api/openai';
import './Home.scss';

// Reducer para manejar el estado del diagnóstico
const initialState = {
  step: 'welcome',
  vehicleData: null,
  currentQuestion: '',
  questionCount: 0,
  historial: [],
  diagnosis: '',
  isLastQuestion: false,
  warningMessage: '',
};

const diagnosisReducer = (state, action) => {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_VEHICLE_DATA':
      return { ...state, vehicleData: action.payload };
    case 'SET_QUESTION':
      return {
        ...state,
        currentQuestion: action.payload,
        questionCount: state.questionCount + 1,
        isLastQuestion: false,
        warningMessage: '',
      };
    case 'ADD_TO_HISTORIAL':
      return { ...state, historial: [...state.historial, ...action.payload] };
    case 'SET_DIAGNOSIS':
      return { ...state, diagnosis: action.payload, step: 'diagnosis' };
    case 'SET_LAST_QUESTION':
      return { ...state, isLastQuestion: true };
    case 'SET_WARNING':
      return { ...state, warningMessage: action.payload };
    case 'CLEAR_WARNING':
      return { ...state, warningMessage: '' };
    default:
      return state;
  }
};

function Home() {
  const [state, dispatch] = useReducer(diagnosisReducer, initialState);

  const handleStartDiagnosis = () => dispatch({ type: 'SET_STEP', payload: 'vehicleForm' });

  const handleVehicleSubmit = async (data) => {
    dispatch({ type: 'SET_VEHICLE_DATA', payload: data });
    try {
      const response = await iniciarDiagnostico(data);
      dispatch({ type: 'SET_QUESTION', payload: response.pregunta });
      dispatch({ type: 'ADD_TO_HISTORIAL', payload: [{ tipo: 'problema', texto: data.problema }] });
      dispatch({ type: 'SET_STEP', payload: 'questions' });
    } catch (error) {
      console.error('Error al iniciar el diagnóstico:', error);
      alert('Ocurrió un error al iniciar el diagnóstico. Intenta nuevamente.');
    }
  };

  const handleQuestionSubmit = async (answer) => {
    const updatedHistorial = [
      { tipo: 'pregunta', texto: state.currentQuestion },
      { tipo: 'respuesta', texto: answer },
    ];
    dispatch({ type: 'ADD_TO_HISTORIAL', payload: updatedHistorial });

    try {
      const response = await continuarDiagnostico(state.historial, state.vehicleData);
      if (response.advertencia) {
        dispatch({ type: 'SET_WARNING', payload: response.advertencia });
      } else if (response.pregunta) {
        dispatch({ type: 'SET_QUESTION', payload: response.pregunta });
        if (response.es_ultima) dispatch({ type: 'SET_LAST_QUESTION' });
      } else if (response.diagnostico_y_soluciones) {
        dispatch({ type: 'SET_DIAGNOSIS', payload: response.diagnostico_y_soluciones });
      }
    } catch (error) {
      console.error('Error al continuar el diagnóstico:', error);
      alert('Ocurrió un error al continuar el diagnóstico. Intenta nuevamente.');
    }
  };

  // Función para cerrar el mensaje de advertencia
  const handleCloseWarning = () => dispatch({ type: 'CLEAR_WARNING' });

  return (
    <div className="home">
      {state.warningMessage && (
        <WarningMessage
          message={state.warningMessage}
          onClose={handleCloseWarning}
        />
      )}
      {state.step === 'welcome' && <WelcomeDialog onStart={handleStartDiagnosis} />}
      {state.step === 'vehicleForm' && <VehicleForm onSubmit={handleVehicleSubmit} />}
      {state.step === 'questions' && (
        <QuestionForm
          question={state.currentQuestion}
          onSubmit={handleQuestionSubmit}
          questionNumber={state.questionCount + 1}
          maxQuestions={5}
          isLastQuestion={state.isLastQuestion}
        />
      )}
      {state.step === 'diagnosis' && <Diagnosis diagnosis={state.diagnosis} />}
    </div>
  );
}

export default Home;





