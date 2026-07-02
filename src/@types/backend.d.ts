declare interface IServer {
  baseDomain?: string;
  clientId?: string;
  createdAt?: string;
  id: string;
  serverName: string;
  slug: string;
  subDomain: string;
  updatedAt?: string;
  url?: string;
}
declare interface Client {
  baseDomain: string;
  clientName: string;
  createdAt?: string;
  id: string;
  slug?: string;
  servers?: IServer[];
}
