const fake = {
  datas: [
    {
      codigo: 2280,
      data: '2021-03-25T10:51:25.854',
      doacoes: 400,
      premios: 200,
      saldo: 200
    },
    {
      codigo: 2281,
      data: '2021-03-26T10:51:25.854',
      doacoes: 100,
      premios: 50,
      saldo: 50
    },
    {
      codigo: 2283,
      data: '2021-03-27T10:51:25.854',
      doacoes: 200,
      premios: 50,
      saldo: 150
    },
    {
      codigo: 2284,
      data: '2021-03-28T10:51:25.854',
      doacoes: 300,
      premios: 0,
      saldo: 300
    },
    {
      codigo: 2285,
      data: '2021-03-29T10:51:25.854',
      doacoes: 75,
      premios: 500,
      saldo: 425
    },
    {
      codigo: 2286,
      data: '2021-03-30T10:51:25.854',
      doacoes: 175,
      premios: 200,
      saldo: -25
    },
    {
      codigo: 2287,
      data: '2021-03-31T10:51:25.854',
      doacoes: 100,
      premios: 200,
      saldo: -100
    },
    {
      codigo: 2288,
      data: '2021-04-01T10:51:25.854',
      doacoes: 600,
      premios: 400,
      saldo: 200
    }
  ],
  saldo_atual: 1300, // 75 que o POS já tinha guardado + 100 do total das datas acima
  comissao: 0.01,
  premios_nao_pagos: 6,
  datahora: '2021-03-30T17:06:25.116'
};

export default fake as Required<typeof fake>;
