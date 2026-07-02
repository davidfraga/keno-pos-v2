import React from 'react';
import { DataTable } from 'react-native-paper';
import { OperacaoData } from '.';
import { Text } from '@ui-kitten/components';
import moment from 'moment';
import { fontTableBody } from '../../components/Table/styles';

function colorStyle(val: number) {
  
  if(val === 0) return '#3333';

  if(val < 0) return '#e85a5a';

  return '#75CF9D';
}

const ExtratoRow: React.FC<{operacao?: OperacaoData, text?: string}> = ({operacao,text}) => {
  if(!operacao) return (
    <DataTable.Row>
              <DataTable.Cell style={{flex: 1,justifyContent: 'center'}}>
                {text ? <Text style={{fontWeight: 'bold'}}>{text}</Text> : ''}
              </DataTable.Cell>
    </DataTable.Row>
  )
  
  const value = (operacao.entrada || 0) - (operacao.saida || 0);

  return (
    <DataTable.Row>
        <DataTable.Cell style={{ flex: 1.2, overflow:'visible' }}>
              <Text style={fontTableBody}>{moment(operacao?.data).format('DD/MM hh:mm')}</Text>
        </DataTable.Cell>
        <DataTable.Cell numeric style={{flex: 0.5}} >
          <Text  style={[fontTableBody]}>
            {(operacao?.tipo || '--')[0]}
          </Text>
        </DataTable.Cell>
        <DataTable.Cell numeric>
          <Text style={[fontTableBody, {color: (operacao?.entrada || 0) > 0 ? '#75CF9D':'#3333'}]}>
            {operacao?.entrada?.toFixed(2) || '--'}
          </Text>
        </DataTable.Cell>
        <DataTable.Cell numeric>
          <Text style={[fontTableBody, {color: (operacao?.saida || 0) > 0 ? '#e85a5a':'#3333'}]}>
            {operacao.saida?.toFixed(2)}
          </Text>
        </DataTable.Cell>
        <DataTable.Cell numeric>
          <Text style={fontTableBody}>
            {operacao?.saldo_atualizado.toFixed(2) || '--'}
          </Text>
        </DataTable.Cell>
      </DataTable.Row>
  );
}

export default ExtratoRow;