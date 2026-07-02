import React, { useCallback, useState } from 'react';
import { Button, Layout, Text } from '@ui-kitten/components';
import { main, buttonRow, button, textCenter, datePicker, title, iconBtn, dpHolder } from './styles';
import { tableTitle, fontTableTitle, fontTableBody } from '../../components/Table/styles';
import { DataTable } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { v2 } from '../../services/api';
import { Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSettings } from '../../context/settings';

interface IMovimentoResponse {
  movimento: {
    premios_pagos: number;
    sorteio: number;
    cartelas: number;
    doacoes: number;
    comissao: number;
    saldo: number;
  }[];
  totalPago: number;
  totalCartelas: number;
  totalDoacoes: number;
  totalComissao: number;
  totalSaldo: number;
  datahora: number;
}

const diaAtual = new Date();

const MovimentoDiario = () => {
  const [selected, setSelectedModal] = useState<'start' | 'end'>('start');
  const [show, setShow] = useState<boolean>(false);
  const [startdate, setStartDate] = useState<Date>(diaAtual);
  const [endDate, setEndDate] = useState<Date>(diaAtual);
  const [data, setData] = useState<IMovimentoResponse>();
  const [loading, setLoading] = useState(false);
  const { serverName } = useSettings();

  const mountScreen = useCallback(async () => {
    setLoading(true);

    try {
      const rota = `/movimentacao/?inicio=${moment(startdate).format('L')}&fim=${moment(endDate).format('L')}`;
      const { data } = await v2.get(rota);
      setData(data);
    } catch (err) {
      if (err?.response?.data?.details) Alert.alert(serverName, err?.response?.data?.details);
      else Alert.alert('Erro Interno', 'Tente novamente mais tarde');
    }

    setLoading(false);
  }, [endDate, serverName, startdate]);

  const handleSearch = useCallback(() => {
    mountScreen();
  }, [mountScreen]);

  const handleSetDate = useCallback(
    (_: any, date?: Date) => {
      setShow(false);
      if (!date) {
        return;
      }

      switch (selected) {
        case 'start':
          setStartDate(date);
          break;
        case 'end':
          setEndDate(date);
          break;
      }
    },
    [selected]
  );

  const handleOpenModal = useCallback((selected: 'start' | 'end') => {
    setSelectedModal(selected);
    setShow(true);
  }, []);

  return (
    <Layout style={main}>
      <Header
        RightIcon={() => (
          <Button
            accessoryRight={() => (
              <Ionicons
                style={{
                  fontSize: 15
                }}
                color="#fff"
                name="refresh"
              />
            )}
            disabled={loading}
            onPress={mountScreen}
            style={button}
          />
        )}
      />
      <Layout style={title}>
        <Text style={textCenter} category="h4">
          Histórico Por Sorteio:
        </Text>
      </Layout>
      <Layout style={buttonRow}>
        <Layout style={dpHolder}>
          <Text>Data Inicial:</Text>
          <Button style={datePicker} status="basic" onPress={() => handleOpenModal('start')}>
            {moment(startdate).format('L')}
          </Button>
        </Layout>
        <Layout style={dpHolder}>
          <Text>Data Final:</Text>
          <Button style={datePicker} status="basic" onPress={() => handleOpenModal('end')}>
            {moment(endDate).format('L')}
          </Button>
        </Layout>
        <Button
          style={button}
          onPress={handleSearch}
          disabled={loading}
          accessoryLeft={() => <Ionicons style={iconBtn} color="#ffff" name="search-outline" />}
        />
      </Layout>
      <DataTable>
        <DataTable.Header style={tableTitle}>
          <DataTable.Title style={{ flex: 0.6, overflow: 'visible' }}>
            <Text style={[fontTableTitle]}>Sort</Text>
          </DataTable.Title>
          <DataTable.Title numeric>
            <Text style={fontTableTitle}>Doações</Text>
          </DataTable.Title>
          <DataTable.Title numeric>
            <Text style={fontTableTitle}>Prêmios</Text>
          </DataTable.Title>
          <DataTable.Title numeric>
            <Text style={fontTableTitle}>Comissão</Text>
          </DataTable.Title>
          <DataTable.Title numeric>
            <Text style={fontTableTitle}>Saldo</Text>
          </DataTable.Title>
        </DataTable.Header>
        <ScrollView>
          {data?.movimento?.map((sorteio) => (
            <DataTable.Row key={'R:' + sorteio.sorteio}>
              <DataTable.Cell style={{ flex: 0.6 }}>
                <Text style={[fontTableBody, { fontSize: 11 }]}>{sorteio?.sorteio}</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text style={fontTableBody}>{sorteio?.doacoes?.toFixed(2) || '--'}</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text style={fontTableBody}>{sorteio?.premios_pagos?.toFixed(2) || '--'}</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text style={fontTableBody}>{sorteio.comissao?.toFixed(2)}</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text style={fontTableBody}>{sorteio?.saldo.toFixed(2) || '--'}</Text>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </ScrollView>
      </DataTable>
      <DataTable style={{ position: 'absolute', bottom: 0 }}>
        <DataTable.Header style={[tableTitle, { backgroundColor: '#ccc', opacity: 0.9 }]}>
          <DataTable.Title style={{ flex: 0.45 }}>
            <Text style={[fontTableTitle, { color: '#111' }]}>Total:</Text>
          </DataTable.Title>
          <DataTable.Title numeric>
            <Text style={[fontTableTitle, { color: '#111' }]}>{data?.totalDoacoes?.toFixed(2) || '--'}</Text>
          </DataTable.Title>
          <DataTable.Title numeric>
            <Text style={[fontTableTitle, { color: '#111' }]}>{data?.totalPago?.toFixed(2) || '--'}</Text>
          </DataTable.Title>
          <DataTable.Title numeric>
            <Text style={[fontTableTitle, { color: '#111' }]}>{data?.totalComissao?.toFixed(2) || '--'}</Text>
          </DataTable.Title>
          <DataTable.Title numeric>
            <Text style={[fontTableTitle, { color: '#111' }]}>{data?.totalSaldo?.toFixed(2) || '--'}</Text>
          </DataTable.Title>
        </DataTable.Header>
      </DataTable>
      {show ? (
        <DateTimePicker
          testID="dateTimePicker"
          value={selected === 'start' ? startdate : endDate}
          mode={'date'}
          is24Hour={true}
          display="default"
          onChange={handleSetDate}
          maximumDate={selected === 'start' ? endDate : undefined}
          minimumDate={selected === 'end' ? startdate : undefined}
        />
      ) : null}
    </Layout>
  );
};

export default MovimentoDiario;
