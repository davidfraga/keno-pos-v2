declare interface IAccountData {
  id: number;
  nome: string;
  rota: string;
}
declare interface IUser {
  usuario: IAccountData;
  estabelecimento: IAccountData & { rota: string };
  pos: IAccountData;
  token: string;
  pos_cadastrada: boolean;
  rodape: string;
  datahora: string;
  nome_server: string;
  url_qrcode: string;
}

declare interface ILoginResponse extends IUser {
  pos_cadastrada: boolean;
  details: string;
}

type estabelecimento = {
  id: number;
  nome: string;
  endereco: string;
};

declare type AuthResponse =
  | ILoginResponse
  | {
      details: string;
      estabelecimentos: estabelecimento[];
    };

declare type PartialResponse = {
  estabelecimentos: estabelecimento[];
  usuario: string;
  token: string;
  details: string;
  senha: string;
};

declare interface DeviceInfo {
  android_id?: string;
  api_level?: number;
  build_id?: string;
  marca?: string;
  chip?: string;
  mac_address?: string;
  dispositivo_id?: string;
  modelo?: string;
  ip?: string;
  access_code?: string;
}
