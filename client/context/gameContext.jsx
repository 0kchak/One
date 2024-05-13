import React, { createContext, useState } from 'react';

export const GameContext = createContext({});

export function GameContextProvider({ children }) {
  const [selected, setSelected] = useState([]);
  const [sameValueCard, setSameValueCard] = useState([]);
  const [cardsToPlay, setCardsToPlay] = useState([]);

  return (
    <GameContext.Provider value={{ selected, setSelected, sameValueCard, setSameValueCard, cardsToPlay, setCardsToPlay }}>
      {children}
    </GameContext.Provider>
  );
}