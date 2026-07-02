declare module '@env' {
  export const BASE_ENDPOINT: string;
  export const PORT: number;
}
declare module 'react-native-bluetooth-escpos-printer';
declare module 'yaqrcode';
declare module 'moment/src/locale/pt-br';
declare module 'rn-sunmi-inner-printer';
declare module '*.png' {
  const value: any;
  export = value;
}

declare let global: { HermesInternal: null | unknown; [key: string]: any };
