import { addSeconds, differenceInSeconds } from 'date-fns';

const timerSort = (
  dataSort: Date,
  dataServer: Date,
  count: number,
  antecipado: boolean,
  sorteioSelecionado?: SorteioData
) => {
  const dSecond = differenceInSeconds(dataSort, addSeconds(dataServer, count));
  const second = dSecond % 60;
  const minute = Math.floor(dSecond / 60) % 60;
  const hour = Math.floor(Math.floor(dSecond / 60) / 60) % 24;
  const days = Math.floor(Math.floor(Math.floor(dSecond / 60) / 60) / 24);
  if (dSecond < 0) {
    if (sorteioSelecionado) {
      sorteioSelecionado.valor_cartela = sorteioSelecionado.valor_dia;
    }
    if (antecipado) {
      return `Apostas Encerradas`;
    } else {
      return '...';
    }
  } else {
    if (antecipado) {
      return `${days} dias ${hour.toString().padStart(2, '0')}:${minute
        .toString()
        .padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    } else {
      const hour = Math.floor(Math.floor(dSecond / 60) / 60);
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second
        .toString()
        .padStart(2, '0')}`;
    }
  }
};
export default timerSort;
