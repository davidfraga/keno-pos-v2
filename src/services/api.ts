import axios, { AxiosError, AxiosResponse } from 'axios';
import { Alert } from 'react-native';

const BASE_DOMAIN = 'SELECIONE UM SERVIDOR...';
const BASE_ENDPOINT = 'https://001.' + BASE_DOMAIN + '/api';

export const v2 = axios.create({
  baseURL: `${BASE_ENDPOINT}/v2`
});

export const v3 = axios.create({
  baseURL: `${BASE_ENDPOINT}/v3`
});
export const v5 = axios.create({
  baseURL: `${BASE_ENDPOINT}/v5`
});

const servidores = [
  '001',
  '002',
  '003',
  '004',
  '005',
  '006',
  '007',
  '008',
  '009',
  '010',
  '011',
  '012',
  '013',
  '014',
  '015',
  '016',
  '017',
  '018',
  '019',
  '020',
  '021',
  '022',
  '023',
  '024',
  '025',
  '026',
  '027',
  '028',
  '029',
  '030',
  'painel',
  'automatus',
  'devs1',
  'devs2',
  'devs3',
  'devs4'];

export const transformServer = (x: string): IServer => ({
  id: x + Math.floor(Math.random() * 101),
  serverName: x,
  subDomain: x,
  slug: x
});

export const transformClient = (x: { name: string; domain: string; servers?: IServer[] }): Client => ({
  ...x,
  clientName: x.name,
  baseDomain: x.domain,
  id: x.domain + Math.floor(Math.random() * 101),
  servers: x.servers || undefined,
  slug: x.domain.split('.app')[0]
});

export const defaultServers = servidores.map(transformServer);

export const clientes: Client[] = [
  { name: 'Mr Keno', domain: 'mrkeno.app' },
  { name: 'Keno Online', domain: 'kenoonline.app' },
  { name: 'Super Sorte', domain: 'supersorte.app' },
  { name: 'Bin Gold', domain: 'bingold.app' },
  { name: 'Bola 90', domain: 'bola90.app' },
  { name: 'Keno da Sorte', domain: 'kenodasorte.app' }
]
  .map(transformClient)
  .map((x) => ({ ...x, servers: defaultServers }));

const responseInterceptor = (response: AxiosResponse<any>) => {
  if (process.env.NODE_ENV === 'development' && response.data) {
    // Ignore
  }
  return response;
};

const interceptorId: number[] = [];

export const SetOnInvalidSession = (callback: () => void) => {
  const errorInterceptor = (error: AxiosError) => {
    const status = error.response?.status;

    if (process.env.NODE_ENV === 'development') {
      console.log(error.request._url);
      console.log(error.response);
    }

    if (!status) {
      Alert.alert('Falha de conexão', 'Verifique sua conexão com a internet');
      callback?.();
      return;
    }

    if (status === 401) {
      alert('Sessão Detectada em outro dispositivo');
      callback?.();
      return;
    }

    return Promise.reject(error);
  };

  v2.interceptors.response.eject(interceptorId[0]);
  v3.interceptors.response.eject(interceptorId[1]);

  interceptorId[0] = v2.interceptors.response.use(responseInterceptor, errorInterceptor);
  interceptorId[1] = v3.interceptors.response.use(responseInterceptor, errorInterceptor);
};

export const setBaseUrl = (id: string, domain = BASE_DOMAIN) => {
  v2.defaults.baseURL = `https://${id}.${domain}/api/v2`;
  v3.defaults.baseURL = `https://${id}.${domain}/api/v3`;
  v5.defaults.baseURL = `https://${id}.${domain}/api/v5`;
};

export const getServer = () => {
  return v2.defaults.baseURL?.split('/api')[0].split('//')[1].replace('.app', '') || '';
};

export const getPreServer = () => {
  const server = v2.defaults.baseURL?.split('/api')[0].split('//')[1].replace('.app', '').split('.') || '';
  return `${server[0]} ${server[1]}`;
};

export const getFullServer = () => {
  return v2.defaults.baseURL?.split('/api')[0];
};

export const setToken = (token: string, sessao?: string) => {
  const Token = token ? `Token ${token}` : '';
  const session = sessao || '';

  v2.defaults.headers.Authorization = Token;
  v2.defaults.headers.common.Authorization = session;
  v2.defaults.headers.common.sessao = session;

  v3.defaults.headers.Authorization = Token;
  v3.defaults.headers.common.Authorization = session;
  v3.defaults.headers.common.sessao = session;

  v5.defaults.headers.Authorization = Token;
  v5.defaults.headers.common.Authorization = session;
  v5.defaults.headers.common.sessao = session;
};
