import React, { useCallback, useContext, useEffect, useState } from 'react';
import { clientes, defaultServers, setBaseUrl, transformClient } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { printerType } from '../templates/universal';
import axios from 'axios';

interface ISettingsContext {
  server: string;
  clients: Client[];
  baseDomain: string;
  serverName: string;
  setServer: (id: IServer) => Promise<void>;
  setDomain: (id: Client) => Promise<void>;
  driver: printerType;
  setDriver: (driver: printerType) => void;
}

const SettingsContext = React.createContext<ISettingsContext>({
  server: '001'
} as ISettingsContext);

export const SettingsProvider: React.FC = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(clientes);
  const [server, setServer] = useState('001');
  const [serverName, setServerName] = useState('Carregando Servidor');
  const [driver, setDriver] = useState<printerType>('bluetooth');
  const [baseDomain, setBaseDomain] = useState<string>('Carregando Servidor');

  useEffect(() => {
    async function fetchData() {
      const server = (await AsyncStorage.getItem('@GDSK:server')) || '001';
      const baseDomain = (await AsyncStorage.getItem('@GDSK:domain')) || 'Selecione um Cliente';
      const serverName = (await AsyncStorage.getItem('@GDSK:name')) || 'Selecione um Servidor';
      const driver = ((await AsyncStorage.getItem('@GDSK:driver')) as printerType) || 'bluetooth';
      const savedClients: Client[] = JSON.parse((await AsyncStorage.getItem('@GDSK:clients')) || 'null') || clientes;

      setBaseDomain(baseDomain);
      setDriver(driver);
      setServer(server);
      setServerName(serverName);
      setBaseUrl(server, baseDomain);
      setClients(savedClients);

      try {
        const clientsData = await axios
          .get<{ name: string; domain: string }[]>('https://hub.mrkeno.app/cdn/clientes.json')
          .then((res) => res.data);

        if (!clientsData) return;

        const data = clientsData
          .map(transformClient)
          .map((x) => ({ ...x, servers: defaultServers }));

        await AsyncStorage.setItem('@GDSK:clients', JSON.stringify(data));
        setClients(data);
      } catch {
        console.log('errr');
        setClients(savedClients);
      }
    }

    fetchData();
  }, []);

  const handleSetServer = useCallback(
    async ({ subDomain }: IServer) => {
      setServer(subDomain);
      setBaseUrl(subDomain, baseDomain);
      await AsyncStorage.setItem('@GDSK:server', subDomain);
    },
    [baseDomain]
  );

  const handleSetDomain = useCallback(
    async ({ clientName, baseDomain }: Client) => {
      setBaseDomain(baseDomain);
      setServerName(clientName);
      setBaseUrl(server, baseDomain);
      await AsyncStorage.setItem('@GDSK:domain', baseDomain);
      await AsyncStorage.setItem('@GDSK:name', clientName);
    },
    [server]
  );

  const handleSetDriver = (driver: printerType) => {
    setDriver(driver);
    AsyncStorage.setItem('@GDSK:driver', driver);
  };

  const value: ISettingsContext = {
    clients,
    server,
    baseDomain,
    setDomain: handleSetDomain,
    setServer: handleSetServer,
    driver: driver,
    setDriver: handleSetDriver,
    serverName
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  return context;
};
