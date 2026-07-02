import React, { useCallback, useEffect, useState } from 'react';
import { Card, Layout, Text, Input, Button } from '@ui-kitten/components';
import { DataTable, Divider, Modal } from 'react-native-paper';
import { main, buttonRow, button, title, textCenter, search, textSaldo, iconBtn, buttonSolicitacao } from './styles';
import { tableTitle, fontTableTitle, fontTableBody } from '../../components/Table/styles';
import moment from 'moment';
import { Alert, Keyboard, RefreshControl, ScrollView, TouchableWithoutFeedback } from 'react-native';
import Header from '../../components/Header';
import { v3, v5 } from '../../services/api';
import { useAuth } from '../../context/auth/auth';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../../context/settings';
import { useMemo } from 'react';

export const Recebimentos = () => {
  const [recebimentos, setRecebimentos] = useState<IRecebimentos>();
  const [modal, showModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qtdRecebida, setQtdRecebida] = useState('');
  const [vendedor_senha, setSenha] = useState('');
  const [recData, setRecData] = useState<RecolheData>();
  const navigation = useNavigation();
  const { user, deviceInfo } = useAuth();
  const { driver, serverName } = useSettings();
  const [isSecured, setSecured] = useState<boolean>(true);
  const [dataAtual, setDataAtual] = useState<Date>(new Date());
  const [tipo, setTipo] = useState<string>();
  const needRestart = useMemo(() => {
    if (!recebimentos) return false;

    const limite = moment(recebimentos.datahora).add(4, 'minutes');
    const atual = moment(dataAtual);
    return atual.isAfter(limite);
  }, [recebimentos, dataAtual]);
  const handleToggle = () => setSecured(!isSecured);

  const RenderIcon = () => (
    <TouchableWithoutFeedback onPress={handleToggle} style={{ marginRight: 10 }}>
      <Ionicons
        style={{
          fontSize: 16
        }}
        name={isSecured ? 'eye-off' : 'eye'}
      />
    </TouchableWithoutFeedback>
  );

  const handleRecolher = useCallback(async () => {
    if (!vendedor_senha)
      return Alert.alert('Senha Inválida', 'Informe uma senha válida');

    setLoading(true);
    try {
      const response = await v5.post('/solicitacao_recolhe/', {
        senha: vendedor_senha,
        valor: qtdRecebida,
        tipo
      });
      alert(response.data.detail);

      showModal(false);
      setQtdRecebida('');
      setSenha('');
    } catch (err: any) {
      console.log(err);
      if (err?.response?.data?.detail) alert(err?.response?.data?.detail);
      else alert('Erro Interno');
    }

    setLoading(false);
  }, [tipo, vendedor_senha, qtdRecebida]);

  const handleCloseModal = useCallback(
    () => {
      showModal(false)
      setSenha('');
    },

    []
  );

  const handleSetRecebido = useCallback((qtd: string) => {
    if (typeof qtd != 'string') return;
    const nmbr = qtd.replace(',', '.').replace('-', '');
    if (nmbr != '-' && -isNaN(nmbr as any)) {
      return;
    }
    setQtdRecebida(nmbr);
  }, []);

  const mountScreen = useCallback(async () => {
    setLoading(true);


    try {
      const { data } = await v3.get<IRecebimentos>(`/recebimentos/${user?.pos.id}/`);
      setRecebimentos({
        ...data,
        saldoLiquido: Math.round(data.saldoLiquido * 100) / 100,
        saldoAnterior: Math.round(data.saldoAnterior * 100) / 100,
        totalSaldo: Math.round(data.totalSaldo * 100) / 100
      });
    } catch (err) {
      if (err?.response?.data?.details) Alert.alert(serverName, err?.response?.data?.details);
      else Alert.alert('Erro Interno', 'Tente novamente mais tarde');
    }

    setLoading(false);
  }, [serverName, user?.pos.id]);

  useEffect(() => {
    mountScreen();

    const interval = setInterval(() => setDataAtual(new Date()), 1000 * 60 * 1);
    navigation.addListener('focus', mountScreen);
    return () => {
      navigation.removeListener('focus', mountScreen);
      clearInterval(interval);
    };
  }, [mountScreen, navigation]);

  const handleOpenModal = useCallback(() => {
    if (needRestart) {
      mountScreen();
      return;
    }
    if (!recebimentos) return;
    if (!qtdRecebida) return Alert.alert('Valor inválido', 'informe um valor da solicitação!');

    const number = Number.parseFloat(qtdRecebida);
    if (recebimentos.saldoLiquido < 0 && number > 0) {
      setTipo('A');
    } else {
      setTipo('T');
    }

    Keyboard.dismiss();
    showModal(true);
  }, [needRestart, recebimentos, qtdRecebida, mountScreen]);

  const OkRecibo = useCallback(() => {
    mountScreen();
    setRecData(undefined);
  }, [mountScreen]);

  return (
    <Layout style={{ height: '100%' }}>
      <Header
        RightIcon={() => (
          <>
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
          </>
        )}
      />
      <Layout style={[main, { flex: 1 }]} level={'1'}>
        <Layout style={title}>
          <Text style={textCenter} category="h4">
            Recebimentos/Recolhe:
          </Text>
          <Text style={textSaldo}>Saldo Atual: {recebimentos?.saldoLiquido?.toFixed(2) || '--'}</Text>
        </Layout>
        <Layout style={buttonRow}>
          <Input
            keyboardType="numeric"
            onChangeText={handleSetRecebido}
            value={qtdRecebida}
            style={search}
            disabled={needRestart}
            placeholder="Valor"
          />
          <Button onPress={handleOpenModal} style={buttonSolicitacao} disabled={loading} status={needRestart ? 'warning' : undefined}>
            {needRestart
              ? 'Atualizar'
              : (recebimentos?.saldoLiquido || 0) < 0
              ? 'Solicitar pagamento'
              : 'Solicitar Recebimento'}
          </Button>
        </Layout>
        <Layout
          style={{
            alignContent: 'center',
            alignItems: 'center',
            marginBottom: 10
          }}
        >
          <Text category="p2" style={{ color: 'red', marginTop: 10, fontWeight: 'bold' }}>
            Saldo Anterior: {recebimentos?.saldoAnterior?.toFixed(2) || '---'}
          </Text>
          <Text category="p2" style={{ color: 'black', marginTop: 5 }}>
            Último Recolhe: {recebimentos?.ultimoRecolhe ? moment(recebimentos?.ultimoRecolhe).format('L LTS') : '--'}
          </Text>
          <Text category="p2" style={{ color: 'black', marginTop: 5 }}>
            Última Atualização: {recebimentos?.datahora ? moment(recebimentos?.datahora).format('L LTS') : '--'}
          </Text>
        </Layout>
        <Layout style={{ flex: 1 }}>
          <DataTable>
            <DataTable.Header style={tableTitle}>
              <DataTable.Title style={{ flex: 0.6 }}>
                <Text style={fontTableTitle}>Dia</Text>
              </DataTable.Title>
              <DataTable.Title numeric>
                <Text style={fontTableTitle}>Doações</Text>
              </DataTable.Title>
              <DataTable.Title numeric>
                <Text style={fontTableTitle}>Prêmios</Text>
              </DataTable.Title>
              <DataTable.Title numeric>
                <Text style={fontTableTitle}>Comissões</Text>
              </DataTable.Title>
              <DataTable.Title numeric style={{ flex: 0.5 }}>
                <Text style={fontTableTitle}>Saldo</Text>
              </DataTable.Title>
            </DataTable.Header>

            <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={mountScreen} />}>
              {recebimentos?.datas?.map((dia) => (
                <DataTable.Row key={dia.data}>
                  <DataTable.Cell style={{ flex: 0.6 }}>
                    <Text style={fontTableBody}>{moment(dia.data).format('DD/MM')}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Text style={fontTableBody}>{dia.doacoes?.toFixed(2) || '--'}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Text style={fontTableBody}>{dia.premios?.toFixed(2) || '--'}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Text style={fontTableBody}>{dia.comissao?.toFixed(2) || '--'}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric style={{ flex: 0.7 }}>
                    <Text style={fontTableBody}>{dia.saldo?.toFixed(2) || '--'}</Text>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
              <DataTable.Row>
                <DataTable.Cell>
                  <Text style={fontTableBody}> </Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={fontTableBody}>{''}</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={fontTableBody}>{''}</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={fontTableBody}>{''}</Text>
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell>
                  <Text style={fontTableBody}> </Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={fontTableBody}>{''}</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={fontTableBody}>{''}</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={fontTableBody}>{''}</Text>
                </DataTable.Cell>
              </DataTable.Row>
            </ScrollView>
          </DataTable>

          <DataTable style={{ position: 'absolute', bottom: 0 }}>
            <DataTable.Header style={[tableTitle, { backgroundColor: '#ccc', opacity: 0.9 }]}>
              <DataTable.Title style={{ flex: 0.6 }}>
                <Text style={[fontTableTitle, { color: '#111' }]}>Total:</Text>
              </DataTable.Title>
              <DataTable.Title numeric>
                <Text style={[fontTableTitle, { color: '#111' }]}>
                  {recebimentos?.totalDoacoes?.toFixed(2) || '--'}
                </Text>
              </DataTable.Title>
              <DataTable.Title numeric>
                <Text style={[fontTableTitle, { color: '#111' }]}>
                  {recebimentos?.totalPremios?.toFixed(2) || '--'}
                </Text>
              </DataTable.Title>
              <DataTable.Title numeric>
                <Text style={[fontTableTitle, { color: '#111' }]}>
                  {recebimentos?.totalComissao?.toFixed(2) || '--'}
                </Text>
              </DataTable.Title>
              <DataTable.Title numeric style={{ flex: 0.7 }}>
                <Text style={[fontTableTitle, { color: '#111' }]}>{recebimentos?.totalSaldo?.toFixed(2) || '--'}</Text>
              </DataTable.Title>
            </DataTable.Header>
          </DataTable>
        </Layout>
      </Layout>
      <Modal
        visible={!!recData && recData?.operacoes.length > 0}
        onDismiss={handleCloseModal}
        style={{ width: '75%', marginHorizontal: '12%' }}
      >
        {recData?.operacoes?.map((op) => (
          <Layout>
            <Card
              style={{
                display: 'flex',
                alignSelf: 'center',
                paddingVertical: 20,
                width: '90%'
              }}
            >
              <Text category="h5" style={{ textAlign: 'center', marginBottom: 10 }}>
                Recibo de Recolhe:
              </Text>
              <Divider
                style={{
                  borderWidth: 1,
                  borderStyle: 'dashed',
                  borderRadius: 1
                }}
              />
              <ScrollView>
                <Layout key={op.id + 'op'} style={{ width: '100%' }}>
                  {op.tipo ? (
                    <Text category="s2" style={{ marginBottom: 1 }}>
                      Tipo: {op.tipo}
                    </Text>
                  ) : null}
                  {op.descrição ? (
                    <Text category="s2" style={{ marginBottom: 1 }}>
                      Descrição: {op.descrição}
                    </Text>
                  ) : null}
                  <Divider style={{ borderWidth: 0.3 }} />
                  {op.origem ? (
                    <Text category="s2" style={{ marginBottom: 1 }}>
                      Origem: {op.origem}
                    </Text>
                  ) : null}
                  {op.destino ? (
                    <Text category="s2" style={{ marginBottom: 1 }}>
                      Destino: {op.destino}
                    </Text>
                  ) : null}
                  <Divider style={{ borderWidth: 0.3 }} />
                  {op.valor ? (
                    <Text category="p1" style={{ marginBottom: 1, fontWeight: 'bold' }}>
                      Valor: {op.valor.toFixed(2)}
                    </Text>
                  ) : null}
                  <Divider
                    style={{
                      borderWidth: 1,
                      borderStyle: 'dashed',
                      borderRadius: 1
                    }}
                  />
                </Layout>
              </ScrollView>
              <Layout
                style={{
                  flexDirection: 'row',
                  marginTop: 20,
                  justifyContent: 'space-between'
                }}
              >
                <Button
                  style={{ width: '20%' }}
                  status="basic"
                  disabled={loading}
                  onPress={handlePrint}
                  accessoryLeft={() => <Ionicons style={iconBtn} color="#333" name="print" />}
                />
                <Button disabled={loading} onPress={OkRecibo}>
                  Confirmar
                </Button>
              </Layout>
            </Card>
          </Layout>
        ))}
      </Modal>
      <Modal visible={modal} onDismiss={handleCloseModal} style={{ width: '75%', marginHorizontal: '12%' }}>
        <Layout>
          <Card style={{ display: 'flex', alignSelf: 'center', padding: 20 }}>
            <Text category="p1" style={{ textAlign: 'center' }}>
              Valor solicitado:{' '}
              {Number.parseFloat(qtdRecebida || '0')
                .toFixed(2)
                .toString()}
            </Text>
            <Text category="h6" style={{ textAlign: 'center', marginBottom: 10, marginTop: 5, fontWeight: 'bold' }}>
              Confirme Sua Senha:
            </Text>
            <Input
              style={{ marginVertical: 10, flexDirection: 'row' }}
              onChangeText={setSenha}
              value={vendedor_senha}
              autoCapitalize="none"
              placeholder="Senha"
              autoComplete="off"
              autoCorrect={false}
              contextMenuHidden={true}
              accessoryRight={RenderIcon}
              secureTextEntry={isSecured}
            />
            <Layout style={{ flexDirection: 'row', alignSelf: 'center' }}>
              <Button onPress={handleCloseModal} appearance="ghost" style={{ marginTop: 20, marginRight: 0 }}>
                Cancelar
              </Button>
              <Button disabled={loading} onPress={handleRecolher} style={{ marginTop: 20 }}>
                Confirmar
              </Button>
            </Layout>
          </Card>
        </Layout>
      </Modal>
    </Layout>
  );
};

export default Recebimentos;
