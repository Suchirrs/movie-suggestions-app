import React, { createContext, useState } from "react";

// Create Context
export const UserContext = createContext();

// Context Provider Component
export const UserProvider = ({ children }) => {
  const [name, setName] = useState("");

  return (
    <UserContext.Provider value={{ name, setName }}>
      {children}
    </UserContext.Provider>
  );
};
