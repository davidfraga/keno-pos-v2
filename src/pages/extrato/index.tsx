import React, { useCallback, useState } from 'react';
import { Button, Layout, Select, SelectItem, Text } from '@ui-kitten/components';
import { main, button, textCenter, title } from './styles';
import { tableTitle, fontTableTitle } from '../../components/Table/styles';
import { DataTable } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { v2 } from '../../services/api';
import { Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSettings } from '../../context/settings';
import { textSaldo } from '../recebimentos/styles';
import fake from './fake';
import { useAuth } from '../../context/auth/auth';
import { useEffect } from 'react';
import ExtratoRow from './Row';

export type OperacaoData = {
  codigo: number;
  data: string;
  tipo: string;
  entrada: number;
  saida: number;
  saldo_anterior: number;
  saldo_atualizado: number;
};

type ApiResponse = typeof fake;

const Operacoes = [
  { nome: 'Todas', sigla: undefined },
  { nome: 'Recolhe', sigla: 'T' },
  { nome: 'Prêmio', sigla: 'P' },
  { nome: 'Comissão', sigla: 'C' },
  { nome: 'Venda', sigla: 'V' },
  { nome: 'Aporte', sigla: 'A' },
  { nome: 'Devolução', sigla: 'D' }
] as const;

type Operacao = typeof Operacoes[number];

const ExtratoFinanceiro = () => {
  const [extrato, setExtrato] = useState<ApiResponse>();
  const [loading, setLoading] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [opFilter, setOpFilter] = useState<Operacao>();
  const { serverName } = useSettings();

  const { user } = useAuth();

  const handleSetOp = (op?: Operacao) => {
    if (op?.sigla === opFilter?.sigla) return;

    setPagina(1);
    setOpFilter(op);
  };

  const mountScreen = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await v2.get<ApiResponse>(`/transacoes/${user?.pos.id}/`, {
        params: {
          pagina,
          tipo: opFilter?.sigla
        }
      });
      setExtrato(data);
    } catch (err) {
      if (err?.response?.data?.details) Alert.alert(serverName, err?.response?.data?.details);
      else Alert.alert('Erro Interno', 'Tente novamente mais tarde');
    }

    setLoading(false);
  }, [opFilter?.sigla, pagina, serverName, user?.pos.id]);

  useEffect(() => {
    mountScreen();
  }, [mountScreen]);

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
          Extrato Financeiro:
        </Text>
      </Layout>
      <Layout>
        <Text style={textSaldo} category="h4">
          Saldo atual: {extrato?.saldo.toFixed(2) || '--'}
        </Text>
      </Layout>
      <Layout style={{ padding: 10, flexDirection: 'row', justifyContent: 'center' }}>
        <Select
          style={{ width: 300 }}
          placeholder={opFilter ? 'Apenas ' + opFilter.nome : 'Todas as Operações'}
          onSelect={(data) => {
            if (Array.isArray(data)) return;
            const op = Operacoes[data.row];
            handleSetOp(op?.sigla ? op : undefined);
          }}
        >
          {Operacoes.map((type) => {
            return (
              <SelectItem
                key={`select_${type.sigla || 'Td'}`}
                title={(evaProps) => <Text {...evaProps}>{type.nome}</Text>}
              />
            );
          })}
        </Select>
      </Layout>
      <DataTable>
        <DataTable.Header style={tableTitle}>
          <DataTable.Title style={{ flex: 1.2, overflow: 'visible' }}>
            <Text style={[fontTableTitle]}>Ref</Text>
          </DataTable.Title>

          <DataTable.Title numeric style={{ flex: 0.5 }}>
            <Text style={[fontTableTitle]} ellipsizeMode="clip">
              OP
            </Text>
          </DataTable.Title>
          <DataTable.Title numeric>
            <Text style={fontTableTitle}>Entrada</Text>
          </DataTable.Title>
          <DataTable.Title numeric>
            <Text style={fontTableTitle}>Saida</Text>
          </DataTable.Title>
          <DataTable.Title numeric>
            <Text style={fontTableTitle}>Saldo</Text>
          </DataTable.Title>
        </DataTable.Header>
        <ScrollView>
          {extrato?.dados.map((sorteio) => (
            <ExtratoRow key={sorteio.codigo} operacao={sorteio} />
          ))}
          <ExtratoRow text={extrato && extrato.pagina === extrato.paginas ? 'Ultimo Registro' : ''} />
          <ExtratoRow />
          <ExtratoRow />
          <ExtratoRow />
          <ExtratoRow />
          <ExtratoRow />
          <ExtratoRow />
        </ScrollView>
      </DataTable>
      <Layout
        style={{
          position: 'absolute',
          bottom: 0,
          flexDirection: 'row',
          backgroundColor: 'rgba(240, 240, 240, 0.9)',
          width: '100%',
          padding: 15,
          alignContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'center'
        }}
      >
        <Layout style={{ flexDirection: 'row', alignSelf: 'center' }}>
          {Array(5)
            .fill(0)
            .map((_, i) => {
              const startVal = Math.max(pagina - 3, 1);
              const val = startVal + i;

              return (
                <Button
                  style={{
                    marginLeft: 5,
                    width: 60
                  }}
                  disabled={loading || (extrato && val > extrato.paginas)}
                  onPress={() => setPagina(val)}
                  appearance={pagina === val ? 'filled' : 'outline'}
                  status={pagina === val ? 'primary' : 'basic'}
                  key={'pag' + i}
                >
                  {val}
                </Button>
              );
            })}
        </Layout>
      </Layout>
    </Layout>
  );
};

export default ExtratoFinanceiro;
