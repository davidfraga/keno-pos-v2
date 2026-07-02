declare interface IBilheteLote {
  codigo: number;
  valor_doado: number;
  bilhetes: IBilhete[];
  bilhetes_invalidos: IBilheteInvalido[]
}
declare interface IBilheteInvalido {
  partida: number;
}

declare interface IBilhete {
  bilhete: number;
  sorteio?: number;
  codigo: number;
  tipo_rodada: string;
  data_partida: string;
  valor_kuadra: number;
  valor_kina: number;
  valor_keno: number;
  valor_acumulado: number;
  valor_cartela: number;
  vencedores_kuadra: number[];
  vencedores_kina: number[];
  vencedores_keno: number[];
  compartilhavel?: boolean;
  cartelas: Cartela[];
  tipo_impressao: "I" | 'L' | "S"
  datahora: string;
  fake?: string;
  status: -1 | 0 | 1 | 2;
}

declare interface IBilhetePremiado {
  estabelecimento: string,
  bilhetes: IPule[],
  datahora: string,
  total_premio: number,
  quantidade_premio: number
}


declare interface IPule {
  bilhete: string,
  cartelas: ICartelas[]
}

declare interface ICartelas {
  estabelecimento: ((ChildElement | ChildElement[]) & (boolean | ReactChild | ReactFragment | ReactPortal | null)) | undefined;
  codigo: number,
  comprado_em: string,
  linha1_lista: number[],
  linha2_lista: number[],
  linha3_lista: number[],
  sorteio: number,
  tipo_premio: string,
  valor: number,
  acumulado: false,
  premio: {
    datahora: string,
    pago_por: string,
    valor_pago: number
  }
}

declare interface SorteioData extends Partial<IBilhete> {
  valor_antecipado?: number;
  valor_dia?: number;
  datahora: string;
  data_partida: string;
  antecipado: boolean;
  hora_antecipado: string;
}

declare interface Cartela {
  codigo: number;
  estabelecimento: string;
  linha1_lista: number[];
  linha2_lista: number[];
  linha3_lista: number[];
  valor?: number;
  tipo_premio?: string;
  sorteio?: number | string;
}

declare type CartelaVencedora = {
  local: string;
  cartela: number;
  premio: string;
  valor: number;
};

declare type VencedoresData = {
  vencedores: CartelaVencedora[];
  status: "Sorteado" | "não sorteado";
  datahora: string;
  sorteio?: string | number;
  data_sorteio?: string;
}


declare interface Turno {
  codigo: number;
  posicao: number;
  numeros: number[];
}


declare interface PreCompraBilhete {
  sorteio: number;
  qtd_cartelas: number;
  valor_bilhete: number;
}


declare interface PreCompra {
  codigo: number;
  confirmado: boolean;
  valor_total: number;
  bilhetes: PreCompraBilhete[];
  bilhetes_invalidos: PreCompraBilhete[];
}
