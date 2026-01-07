
import React, { useState } from 'react';

function QuestionForm({ question, questionNumber, maxQuestions, onSubmit, isLastQuestion }) {
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true); // Activar estado de carga

    setTimeout(() => {
      onSubmit(answer);
      setAnswer('');
      setIsLoading(false); // Desactivar estado de carga
    }, 2000); // Simulación de espera de 2 segundos
  };

  return (
    <form className="question-form" onSubmit={handleSubmit}>
      <h2>Responde e intenta ser lo más preciso posible</h2>
      <p>{question}</p>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Tu respuesta máx. 150 caracteres"
        maxLength={150}
        required
      ></textarea>
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Interpretando..." : isLastQuestion ? "Finalizar" : "Siguiente"}
      </button>
    </form>
  );
}

export default QuestionForm;
