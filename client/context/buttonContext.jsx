import React, { createContext, useState } from 'react';

export const ButtonContext = createContext({});

export function ButtonContextProvider({ children }) {
  const [inGame, setInGame] = useState(false);
  const [dontShow, setDontShow] = useState(true);
  const [inRoom, setInRoom] = useState(false);
  const [roomId, setRoomId] = useState(0);
  const [tchat, setTchat] = useState(true);
  const [isMusicPlayerVisible, setIsMusicPlayerVisible] = useState(false);


  return (
    <ButtonContext.Provider value={{ inGame, setInGame, dontShow, setDontShow, inRoom, setInRoom, roomId, setRoomId, tchat, setTchat, isMusicPlayerVisible, setIsMusicPlayerVisible}}>
      {children}
    </ButtonContext.Provider>
  );
}