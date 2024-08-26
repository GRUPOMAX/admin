import React, { createContext, useState } from 'react';

// Criação do contexto de usuário
export const UserContext = createContext();

// Componente provider que envolve o app e provê o estado de usuário
export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);

  return (
    <UserContext.Provider value={{ userProfile, setUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};
