import { useState, useContext, createContext } from 'react';
import type React from 'react';
const ModeContext = createContext({});

type props = {
  children: React.ReactNode;
};

const ModeProvider = ({ children }: props) => {
  const [mode, setMode] = useState('normal');
  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};

function useMode() {
  const { mode, setMode } = useContext(ModeContext);
  return { mode, setMode };
}

export { useMode, ModeProvider };
