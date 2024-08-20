//@ts-nocheck
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    // Ensure we're in the browser environment
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      const storedUserName = localStorage.getItem("userName");

      if (storedUserId) {
        setUserId(storedUserId);
      }
      if (storedUserName) {
        setUserName(storedUserName);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ userId, setUserId, userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
