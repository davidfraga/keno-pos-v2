/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { DataTable } from 'react-native-paper';
import { Text } from '@ui-kitten/components';
import moment from 'moment';
import { View } from 'react-native';
import { sorteioColor } from '../../utils/sorteioColors';
import { cronometroAntecipadoReverso, cronometroReverso } from './styles';
import timerSort from './timesort';

const dateStyle = (d: boolean) => (d ? { fontWeight: 'bold' } : {});

const TableDoar: React.FC<{ selected: SorteioData | undefined; count: number }> = ({ selected, count }) => {
  const boldOnDate: any = selected ? dateStyle(!selected.antecipado) : {};
  const boldAntecipado: any = selected ? dateStyle(selected.antecipado) : {};
  const tipo = selected?.tipo_rodada?.split(' ')[0];
  const color = sorteioColor(selected);
  return (
    <>
      <DataTable style={{ marginTop: 15 }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <Text style={{ textAlign: 'left' }}>{selected ? `Sorteio: ${selected?.codigo}` : ''}</Text>
          <Text
            style={{
              flex: 1,
              color: color,
              textAlign: 'center',
              fontWeight: 'bold'
            }}
          >
            {selected ? `${tipo}` : ''}
          </Text>
          <Text style={{ textAlign: 'right' }}>{selected && moment(selected?.data_partida).format('DD/MM - LT')}</Text>
        </View>
        <DataTable.Header>
          <DataTable.Title style={{ justifyContent: 'center' }}>KUADRA</DataTable.Title>
          <DataTable.Title style={{ justifyContent: 'center' }}>KINA</DataTable.Title>
          <DataTable.Title style={{ justifyContent: 'center' }}>KENO</DataTable.Title>
        </DataTable.Header>
        <DataTable.Row>
          {selected !== undefined ? (
            <>
              <DataTable.Cell style={{ justifyContent: 'center' }}>
                <Text>{selected.valor_kuadra?.toFixed(2)}</Text>
              </DataTable.Cell>
              <DataTable.Cell style={{ justifyContent: 'center' }}>
                <Text>{selected.valor_kina?.toFixed(2)}</Text>
              </DataTable.Cell>
              <DataTable.Cell style={{ justifyContent: 'center' }}>
                <Text>{selected.valor_keno?.toFixed(2)}</Text>
              </DataTable.Cell>
            </>
          ) : undefined}
        </DataTable.Row>
      </DataTable>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title style={[{ justifyContent: 'center' }]}>
            <Text category="label" style={{ color: 'green', fontWeight: 'bold' }}>
              ANTECIPADA
            </Text>
          </DataTable.Title>
          <DataTable.Title style={[{ justifyContent: 'center' }]}>
            <Text category="label" style={{ color: 'green', fontWeight: 'bold' }}>
              TEMPO
            </Text>
          </DataTable.Title>
          <DataTable.Title style={[{ justifyContent: 'center' }]}>
            <Text category="label" style={[boldOnDate, {}]}>
              NORMAL
            </Text>
          </DataTable.Title>
        </DataTable.Header>
        <DataTable.Row>
          {selected !== undefined ? (
            <>
              <DataTable.Cell style={{ justifyContent: 'center' }}>
                <Text style={{ color: 'green', fontWeight: 'bold' }}>{selected.valor_antecipado?.toFixed(2)}</Text>
              </DataTable.Cell>
              <DataTable.Cell style={{ justifyContent: 'center' }}>
                {
                  <Text style={cronometroAntecipadoReverso}>
                    {selected.hora_antecipado
                      ? timerSort(
                          new Date(selected.hora_antecipado),
                          new Date(selected.datahora),
                          count,
                          false,
                          selected
                        )
                      : '...'}
                  </Text>
                }
              </DataTable.Cell>
              <DataTable.Cell style={{ justifyContent: 'center' }}>
                <Text style={boldOnDate}>{selected.valor_dia?.toFixed(2)}</Text>
              </DataTable.Cell>
            </>
          ) : undefined}
        </DataTable.Row>
      </DataTable>
    </>
  );
};

export default TableDoar;
