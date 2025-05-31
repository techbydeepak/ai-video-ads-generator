"use client";
import { createContext, useContext, useState } from "react";

// Use lowercase for context name to match your usage
export const userDetailContext = createContext(null);

export function UserDetailProvider({ children }) {
  const [userDetail, setUserDetail] = useState(null);
  
  return (
    <userDetailContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </userDetailContext.Provider>
  );
}

// Optional: Keep this if you want to use the hook approach
export function useUserDetail() {
  const context = useContext(userDetailContext);
  if (!context) {
    throw new Error("useUserDetail must be used within UserDetailProvider");
  }
  return context;
}