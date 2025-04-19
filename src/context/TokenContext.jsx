import { createContext, useContext, useState } from "react";

export const TokenContext = createContext();

export function TokenProvider({ children }) {
  const [inputTokens, setInputTokens] = useState(30);
  const [outputTokens, setOutputTokens] = useState(20);

  return (
    <TokenContext.Provider value={{ inputTokens, setInputTokens, outputTokens, setOutputTokens }}>
      {children}
    </TokenContext.Provider>
  );
}

export const useTokens = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useTokens must be used within a TokenProvider");
  }
  return context;
};