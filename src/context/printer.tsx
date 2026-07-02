/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  BluetoothManager,
  BluetoothEscposPrinter
  // BluetoothTscPrinter
} from 'react-native-bluetooth-escpos-printer';

type ScanResult = { paired: PrinterData[]; found: PrinterData[] };

// const defaultPrinter = { name: 'IposPrinter', address: '00:AA:11:BB:22:CC' };

interface IPrinterContext {
  currentPrinter: IPrinter | undefined;
  printerData: PrinterData | undefined;
  loading: boolean;
  fetchDevices: () => Promise<ScanResult | undefined>;
  connectPrinter: (targetPrinter: PrinterData) => Promise<void>;
}

const PrinterContext = React.createContext<IPrinterContext>({
  loading: false
} as IPrinterContext);

export const PrinterProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [printer, setPrinter] = useState<IPrinter>();
  const [printerData, setPrinterData] = useState<PrinterData>();
  const connectPrinter = async (targetPrinter: PrinterData) => {
    setLoading(true);

    try {
      await BluetoothManager.connect(targetPrinter.address);
      await AsyncStorage.setItem('@GDSK:printer', JSON.stringify(targetPrinter));

      setPrinter(BluetoothEscposPrinter);
      setPrinterData(targetPrinter);
    } catch {
      alert('Impressora Inválida: ' + targetPrinter.address);
      await AsyncStorage.removeItem('@GDSK:printer');
    }
    setLoading(false);
  };

  const fetchDevices = useCallback(async (): Promise<ScanResult | undefined> => {
    setLoading(true);
    try {
      const data = JSON.parse(await BluetoothManager.scanDevices());
      setLoading(false);
      return data;
    } catch {
      setLoading(false);
      return undefined;
    }
  }, []);

  const asignDefault = useCallback(async () => {
    // console.warn('first assign');
    const dvcs = await fetchDevices();
    if (!dvcs) throw new Error('Nenhuma impressora encontrada.');
    await connectPrinter(dvcs.paired[0]);
  }, [fetchDevices]);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const savedData = await AsyncStorage.getItem('@GDSK:printer');
      const printerType = await AsyncStorage.getItem('@GDSK:driver');

      if (printerType && !printerType.includes('bluetooth')) return;

      if (!savedData) {
        return await asignDefault();
      }

      const savedPrinter: PrinterData = JSON.parse(savedData || 'undefined');
      if (savedPrinter) connectPrinter(savedPrinter);
    }

    init().catch(() => {
      // ignore
    });
  }, [asignDefault]);

  return (
    <PrinterContext.Provider
      value={{
        loading,
        currentPrinter: printer,
        fetchDevices,
        connectPrinter,
        printerData
      }}
    >
      {children}
    </PrinterContext.Provider>
  );
};

export const usePrinter = () => {
  const context = useContext(PrinterContext);
  return context;
};
