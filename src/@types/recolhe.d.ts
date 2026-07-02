declare interface RecolheData {
  operacoes: Operacao[];
  valorAtual: number;
  valorRecolhe: number;
}

declare interface Operacao {
  data_transacao: string;
  descrição: string;
  destino: string;
  id: number;
  origem: string;
  tipo: string;
  valor: number;
}

declare interface OperacaoPremio {
  pagamento: {
    codigo: number;
    data_pagamento: string;
    cartela: number;
    valor_pago: number;
  }[];
  sorteio: { id: number; data_partida: string };
  total: number;
  vendedor: string;
  bilhete: string;
  datahora: string;
}

declare interface Premio {
  datahora: string;
  pago_por: string;
  valor_pago: number;
}

declare interface PremioCartela extends IBilhete {
  premio: Premio;
  total_premio: number;
  tipo_premio: string;
  cartelas: (Cartela & {
    premio: Premio;
    acumulado: boolean;
    comprado_em: string;
    datahora: string;
    pago_em: string;
  })[];
}

declare interface IRecebimentos {
  datas: {
    data: string;
    codigo: number;
    doacoes: number;
    premios: number;
    comissao: number;
    saldo: number;
  }[];
  saldoLiquido: number; // (saldoAnterior + totalSaldo)
  saldoAnterior: number;
  ultimoRecolhe: string; // Data
  
  //--------DataTable---------
  totalDoacoes: number;
  totalPremios: number;
  totalComissao: number;
  totalSaldo: number; // TotalDoacoes - totalPremios - totalComissao
  //--------------------------
  saldo_atual: number; // Saldo de recolhe + memoria (deprecated)
  comissao: number; // Taxa de comissão
  premios_nao_pagos: number; // Total de premios não pagos (deprecated)
  datahora: string; // Hora atual
}
