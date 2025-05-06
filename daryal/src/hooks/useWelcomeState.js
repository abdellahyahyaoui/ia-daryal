// src/hooks/useWelcomeState.js
import { useState, useEffect } from 'react';

export function useWelcomeState() {
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Comprobar si el usuario ya ha visto el mensaje de bienvenida
    const welcomeSeen = localStorage.getItem('welcomeSeen') === 'true';
    setHasSeenWelcome(welcomeSeen);
    setIsLoading(false);
  }, []);

  const markWelcomeSeen = () => {
    localStorage.setItem('welcomeSeen', 'true');
    setHasSeenWelcome(true);
  };

  return { hasSeenWelcome, markWelcomeSeen, isLoading };
}