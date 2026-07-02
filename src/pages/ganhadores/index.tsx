import React, { useCallback, useEffect, useState } from 'react';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { main, buttonRow, button, textCenter, search, title, iconBtn } from './styles';
import { tableTitle, fontTableTitle, fontTableBody } from '../../components/Table/styles';
import { ActivityIndicator, DataTable } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { v2 } from '../../services/api';
import { useRoute } from '@react-navigation/native';
import { usePrinter } from '../../context/printer';
import { printVencedores } from '../../templates/vencedores';
import { useAuth } from '../../context/auth/auth';
import Header from '../../components/Header';
import { ScrollView } from 'react-native-gesture-handler';
import { Keyboard } from 'react-native';
import { useSettings } from '../../context/settings';

export const Ganhadores = () => {
  const [vencData, setVencedoresData] = useState<VencedoresData>();
  const [sorteio, setSorteio] = useState<string>();
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const { user, deviceInfo } = useAuth();
  const { driver: altDriver } = useSettings();
  const { currentPrinter } = usePrinter();

  useEffect(() => {
    setVencedoresData(undefined);
    setSorteio('');
  }, [route]);

  const handlePrint = useCallback(async () => {
    if (!vencData) return;

    setLoading(true);

    await printVencedores(altDriver, currentPrinter, vencData, {
      ...(user as IUser),
      ...(deviceInfo as DeviceInfo)
    });

    setLoading(false);
  }, [altDriver, currentPrinter, deviceInfo, sorteio, user, vencData]);

  const handleGetSorteio = useCallback(async () => {
    if (!sorteio) return;

    Keyboard.dismiss();
    try {
      setVencedoresData(undefined);
      setLoading(true);
      const { data } = await v2.post<VencedoresData>(`/ganhadores/`, { sorteio });

      if (data && data.status != 'Sorteado') alert(data.status);

      setLoading(false);
      setVencedoresData({
        ...data,
        sorteio: data.sorteio || sorteio
      });
    } catch (err) {
      setSorteio(undefined);
      setLoading(false);
      if (err?.response?.data?.details) alert(err?.response?.data?.details);
      else alert('Sorteio não encontrado.');
    }
  }, [sorteio]);

  return (
    <Layout style={main}>
      <Header />
      <Layout style={title}>
        <Text style={textCenter} category="h4">
          Ganhadores:
        </Text>
      </Layout>
      {loading ? (
        <ActivityIndicator
          size="large"
          style={{
            position: 'absolute',
            top: '30%',
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        />
      ) : null}
      <Layout style={buttonRow}>
        <Input
          style={search}
          onChangeText={setSorteio}
          value={sorteio}
          keyboardType="decimal-pad"
          placeholder="Código do Sorteio"
        />
        <Button
          style={button}
          onPress={handleGetSorteio}
          accessoryLeft={() => <Ionicons style={iconBtn} color="#ffff" name="search-outline" />}
        />
        <Button
          style={button}
          onPress={handlePrint}
          disabled={loading || !vencData}
          accessoryLeft={() => <Ionicons style={iconBtn} color="#ffff" name="print" />}
        />
      </Layout>
      <Layout>
        <DataTable>
          <DataTable.Header style={tableTitle}>
            <DataTable.Title style={{ flex: 1.5 }}>
              <Text style={fontTableTitle}>Local</Text>
            </DataTable.Title>
            <DataTable.Title numeric>
              <Text style={fontTableTitle}>Cartela</Text>
            </DataTable.Title>
            <DataTable.Title numeric>
              <Text style={fontTableTitle}>Prêmio</Text>
            </DataTable.Title>
            <DataTable.Title numeric>
              <Text style={fontTableTitle}>Valor</Text>
            </DataTable.Title>
          </DataTable.Header>
          <ScrollView>
            {vencData?.vencedores?.map((cart) => (
              <DataTable.Row key={cart.premio + cart.cartela}>
                <DataTable.Cell style={{ flex: 1.5 }}>
                  <Text style={fontTableBody}>{cart.local}</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={fontTableBody}>{cart.cartela}</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={fontTableBody}>{cart.premio?.slice(0, 3) || ''}</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={fontTableBody}>{cart.valor?.toFixed(2) || ''}</Text>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </ScrollView>
        </DataTable>
      </Layout>
    </Layout>
  );
};

export default Ganhadores;
