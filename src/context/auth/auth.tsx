/* global IUser */
// import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { v2, setToken, SetOnInvalidSession } from '../../services/api';
import { version } from '../../../package.json';
import {
  getAndroidId,
  getApiLevel,
  getBuildId,
  getCarrier,
  getDeviceId,
  getMacAddress,
  getBrand,
  getModel,
  getIpAddress
} from 'react-native-device-info';
import moment from 'moment';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useInterval } from '../../utils/useInterval';
import { useSettings } from '../settings';

interface IAuthContext {
  user?: IUser;
  signed: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<IAccountData | undefined>;
  signOut: () => void;
  deviceInfo?: DeviceInfo;
}

const AuthContext = React.createContext<IAuthContext>({
  user: undefined,
  signed: false
} as IAuthContext);

export const AuthProvider: React.FC = ({ children }) => {
  const [userData, setUserData] = useState<IUser | undefined>(undefined);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>();
  const [loading, setLoading] = useState(false);
  const { serverName } = useSettings();
  const handleSetUser = useCallback((user?: IUser) => {
    setUserData(user);
  }, []);

  useInterval(async () => {
    if (!userData || userData.nome_server === 'pradelivery') return;

    try {
      await v2.get('/ping_pos/');
    } catch (err) {
      //ignore
    }
  }, 30000);

  useEffect(() => {
    async function fetchDeviceInfo() {
      const android_id = await getAndroidId();
      let mac_address = (await AsyncStorage.getItem('@GDSK:mac')) || (await getMacAddress());

      let access_code = mac_address;

      if (mac_address.includes('00:00:00')) {
        mac_address = 'MAC Inválido, reinicie o aparelho!';
        access_code = process.env.NODE_ENV === 'development' ? 'dev' : 'dispositivo_invalido';
      } else {
        //console.log('saving mac');
        await AsyncStorage.setItem('@GDSK:mac', mac_address);
      }

      setDeviceInfo({
        api_level: await getApiLevel(),
        build_id: await getBuildId(),
        chip: await getCarrier(),
        ip: await getIpAddress(),
        dispositivo_id: getDeviceId(),
        marca: getBrand(),
        modelo: getModel(),
        android_id,
        mac_address,
        access_code
      });
    }

    fetchDeviceInfo();
  }, [handleSetUser]);

  const signIn = useCallback(
    async (usuario: string, senha: string) => {
      //console.log(serverName);
      if (serverName.toLowerCase() === 'pradelivery') {
        setUserData({ nome_server: 'pradelivery' } as any);
        return;
      }

      if (!deviceInfo) return;
      if (loading) return;

      const payload = {
        mac_address: deviceInfo.access_code,
        android_id: deviceInfo.android_id,
        usuario: usuario,
        senha: senha,
        versao: version
      };

      setLoading(true);
      try {
        const response = await v2.post('/login/', payload, { timeout: 30000 });
        if (!response) {
          setLoading(false);
          return undefined;
        }
        const { data } = response;
        //console.log(data);

        if (moment().diff(data.datahora, 'minutes') != 0) {
          Alert.alert(
            'Horário Inválido',
            'Configure a hora e data do seu\ndispositivo\nHora Correta:\n' + moment(data.datahora).format('L LTS')
          );
          setLoading(false);
          return undefined;
        }

        if (data.details) alert(data.details);

        setToken(data.token, data.session_id);
        handleSetUser({ ...(data || {}), logado: !!data });
        setLoading(false);

        await AsyncStorage.setItem('@GDSK:user', payload.usuario);

        return data.usuario;
      } catch (err: any) {
        const { data } = err?.response || {};

        if (data?.details) alert(data.details);
        else alert('Erro Interno de login');
      }

      setLoading(false);
      return undefined;
    },
    [deviceInfo, handleSetUser, loading, serverName]
  );

  const signOut = useCallback(() => {
    handleSetUser(undefined);
    setToken('');
  }, [handleSetUser]);

  useEffect(() => {
    SetOnInvalidSession(signOut);
  }, [signOut]);

  const value: IAuthContext = {
    user: userData,
    signed: !!userData,
    deviceInfo,
    loading,
    signIn,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
