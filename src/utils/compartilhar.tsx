import moment from "moment";
import { getPreServer } from "../services/api";

export const compartilharMsg = (bilhete : IBilhete,userInfo:IUser & DeviceInfo,version:string) => {
    return `LOCAL:
*${bilhete.cartelas[0].estabelecimento}*
------------------------------------------------------
SORTEIO: *${bilhete.tipo_rodada || ''}*
*${bilhete.sorteio}*
*DATA: ${moment(bilhete.data_partida).format('L LT')}*
------------------------------------------------------
POS: ${userInfo.pos.id} - ${userInfo.mac_address?.slice(12)} ${version}
VENDEDOR: ${userInfo.usuario.nome || ''}
FRANQUIA: ${getPreServer()}
CLIENTE: ${userInfo.estabelecimento.rota}
VALOR CARTELA: ${bilhete.valor_cartela.toFixed(2)}
QTD DE CARTELA: ${bilhete.cartelas.length}
BILHETE: ${bilhete.bilhete}
EMISSÃO: ${moment().format('L LTS')}
------------------------------------------------------
VALOR DOADO:
*${(bilhete.valor_cartela * bilhete.cartelas.length).toFixed(2)}*
------------------------------------------------------
SEQUENCIA DE:
*${bilhete.cartelas[0]?.codigo} a ${bilhete.cartelas?.[bilhete.cartelas?.length - 1]?.codigo}*
------------------------------------------------------
Acesse o link para acompanhar o jogo
https://${userInfo?.url_qrcode}/?bilhete=${bilhete.bilhete}`;
}

export const compartilharMsgNovamente = (bilhete : IBilhete,userInfo:IUser & DeviceInfo,version:string) => {
  return `*** *REENVIO*‼️****
➖➖➖➖➖➖➖
LOCAL:
*${bilhete.cartelas[0].estabelecimento}*
------------------------------------------------------
SORTEIO: *${bilhete.tipo_rodada || ''}*
*${bilhete.sorteio}*
*DATA: ${moment(bilhete.data_partida).format('L LT')}*
------------------------------------------------------
POS: ${userInfo.pos.id} - ${userInfo.mac_address?.slice(12)} ${version}
VENDEDOR: ${userInfo.usuario.nome || ''}
FRANQUIA: ${getPreServer()}
CLIENTE: ${userInfo.estabelecimento.rota}
VALOR CARTELA: ${bilhete.valor_cartela.toFixed(2)}
QTD DE CARTELA: ${bilhete.cartelas.length}
BILHETE: ${bilhete.bilhete}
EMISSÃO: ${moment().format('L LTS')}
------------------------------------------------------
VALOR DOADO:
*${(bilhete.valor_cartela * bilhete.cartelas.length).toFixed(2)}*
------------------------------------------------------
SEQUENCIA DE:
*${bilhete.cartelas[0]?.codigo} a ${bilhete.cartelas?.[bilhete.cartelas?.length - 1]?.codigo}*
------------------------------------------------------
Acesse o link para acompanhar o jogo
https://${userInfo?.url_qrcode}/?bilhete=${bilhete.bilhete}`;
}
 
export const compartilharPreMsg = (lote : IBilheteLote,userInfo:IUser & DeviceInfo,version:string) => {

    let bilhetes_str = ''
    lote.bilhetes.map((bilhete)=>{
        bilhetes_str +=
`
------------------------------------------------------
SORTEIO: *${bilhete.sorteio}*
SORTEIO ${bilhete.tipo_rodada || ''}
DATA PARTIDA: ${moment(bilhete.data_partida).format('L LT')} 
BILHETE: ${bilhete.bilhete}
QTD DE CARTELAS: ${bilhete.cartelas.length}
VALOR CARTELA: ${bilhete.valor_cartela}
VALOR BILHETE: ${(bilhete.valor_cartela * bilhete.cartelas.length).toFixed(2)}
------------------------------------------------------
*SEQUÊNCIA DE:*
*${bilhete.cartelas[0]?.codigo} a ${bilhete.cartelas?.[bilhete.cartelas?.length - 1]?.codigo}*`
    })
    let bilhetes_invalidos_str = ''
    if(lote.bilhetes_invalidos.length > 0){
        bilhetes_invalidos_str = 'Bilhetes do(s) Sorteio(s):'
        lote.bilhetes_invalidos.map((bilhete)=>{
            bilhetes_invalidos_str +=
            `${bilhete.partida}, `
        })
        bilhetes_invalidos_str += 'Não foram efetivados devido à apostas encerradas.'
    }
    return `ESTABELECIMENTO: ${lote.bilhetes[0].cartelas[0].estabelecimento}
POS: ${userInfo.pos.id} - ${userInfo.mac_address?.slice(12)} ${version}
VENDEDOR: ${userInfo.usuario.nome || ''}
ROTA: ${getPreServer()}
VALOR PULE: ${lote.valor_doado}
QTD DE BILHETES: ${lote.bilhetes.length}
PULE: ${lote.codigo}
EMISSÃO: ${moment().format('L LTS')}
${bilhetes_str}
------------------------------------------------------
${bilhetes_invalidos_str}
------------------------------------------------------
Acesse o Link para acompanhar o jogo
------------------------------------------------------
https://${userInfo?.url_qrcode}/?pule=${lote.codigo}`
}

export const compartilharPreMsgNovamente = (lote : IBilheteLote,userInfo:IUser & DeviceInfo,version:string) => {
  let bilhetes_str = '';
  lote.bilhetes.map((bilhete)=>{
      bilhetes_str +=
`
------------------------------------------------------
SORTEIO: *${bilhete.sorteio}*
SORTEIO ${bilhete.tipo_rodada || ''}
DATA PARTIDA: ${moment(bilhete.data_partida).format('L LT')} 
BILHETE: ${bilhete.bilhete}
QTD DE CARTELAS: ${bilhete.cartelas.length}
VALOR CARTELA: ${bilhete.valor_cartela}
VALOR BILHETE: ${(bilhete.valor_cartela * bilhete.cartelas.length).toFixed(2)}
------------------------------------------------------
*SEQUÊNCIA DE:*
*${bilhete.cartelas[0]?.codigo} a ${bilhete.cartelas?.[bilhete.cartelas?.length - 1]?.codigo}*`
  })
  let bilhetes_invalidos_str = ''
  if(lote.bilhetes_invalidos.length > 0){
      bilhetes_invalidos_str = 'Bilhetes do(s) Sorteio(s):'
      lote.bilhetes_invalidos.map((bilhete)=>{
          bilhetes_invalidos_str +=
          `${bilhete.partida}, `
      })
      bilhetes_invalidos_str += 'Não foram efetivados devido à apostas encerradas.'
  }
  return `*** *REENVIO*‼️****
➖➖➖➖➖➖➖
ESTABELECIMENTO: ${lote.bilhetes[0].cartelas[0].estabelecimento}
POS: ${userInfo.pos.id} - ${userInfo.mac_address?.slice(12)} ${version}
VENDEDOR: ${userInfo.usuario.nome || ''}
ROTA: ${getPreServer()}
VALOR PULE: ${lote.valor_doado}
QTD DE BILHETES: ${lote.bilhetes.length}
PULE: ${lote.codigo}
EMISSÃO: ${moment().format('L LTS')}
${bilhetes_str}
------------------------------------------------------
${bilhetes_invalidos_str}
------------------------------------------------------
Acesse o Link para acompanhar o jogo
------------------------------------------------------
https://${userInfo?.url_qrcode}/?pule=${lote.codigo}`
}

export const compartilharReciboMsg = (Operacao: Operacao) => {
  return `*Recibo de Recolhe:*
Data: ${moment().format('L')}
Hora: ${moment().format('LTS')}
------------------------------------------------------
${getPreServer()}

Tipo: ${Operacao.tipo}
------------------------------------------------------
*CARTEIRA:*

Origem: ${Operacao.origem.replace(`CARTEIRA`, '').replace(`de`, '').trim()}
Destino: ${Operacao.destino.replace(`CARTEIRA`, '').replace(`de`, '').trim()}
------------------------------------------------------
*Valor: ${Operacao.valor.toFixed(2)}*`;
}

export const compartilharReciboMsgNovamente = (Operacao: Operacao) => {
  return `*** *REENVIO*‼️****
➖➖➖➖➖➖➖
*Recibo de Recolhe:*
Data: ${moment().format('L')}
Hora: ${moment().format('LTS')}
------------------------------------------------------
${getPreServer()}

Tipo: ${Operacao.tipo}
------------------------------------------------------
*CARTEIRA:*

Origem: ${Operacao.origem.replace(`CARTEIRA`, '').replace(`de`, '').trim()}
Destino: ${Operacao.destino.replace(`CARTEIRA`, '').replace(`de`, '').trim()}
------------------------------------------------------
*Valor: ${Operacao.valor.toFixed(2)}*`;
}