import React, { createContext, useState, useEffect } from "react";

export const GlobalConfigContext = createContext();

export const GlobalConfigProvider = ({ children }) => {
  const [globalConfigs, setGlobalConfigs] = useState(() => {
    const value = localStorage.getItem("globalConfigs");
    if (value) {
      return JSON.parse(value);
    }
    return { delay: "0.295", bgVideo: true };
  });

  // Update local storage when global configs change
  useEffect(() => {
    localStorage.setItem("globalConfigs", JSON.stringify(globalConfigs));
  }, [globalConfigs]);

  return (
    <GlobalConfigContext.Provider value={{ globalConfigs, setGlobalConfigs }}>
      {children}
    </GlobalConfigContext.Provider>
  );
};
