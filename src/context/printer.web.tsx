import React, { useContext } from 'react';

const PrinterContext = React.createContext<any>({
  loading: false,
  currentPrinter: undefined,
  printerData: undefined,
  fetchDevices: async () => undefined,
  connectPrinter: async () => {},
});

export const PrinterProvider: React.FC<any> = ({ children }) => {
  return (
    <PrinterContext.Provider
      value={{
        loading: false,
        currentPrinter: undefined,
        printerData: undefined,
        fetchDevices: async () => undefined,
        connectPrinter: async () => {},
      }}
    >
      {children}
    </PrinterContext.Provider>
  );
};

export const usePrinter = () => useContext(PrinterContext);
