/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { version } from '../../../package.json';
import { Layout, Text, Card, Button, Select, SelectItem, Divider, IndexPath, Input } from '@ui-kitten/components';
import { DataTable } from 'react-native-paper';
import { Modal } from 'react-native-paper';
import {
  backdrop,
  button,
  button1,
  button2,
  buttonImprePreCompra,
  buttonPreCompra,
  content,
  main,
  search,
  searchPreCompra,
  fontTableBodyPreCompra,
  buttonCancelar,
  buttonContador,
  inputContador,
  buttonEnviar,
  cronometroReverso,
  textCronometro,
  campoTempo,
  buttonCompartilhar,
  contador,
  buttonCompartilharPreCompra
} from './styles';
import { usePrinter } from '../../context/printer';
import { notaDefault, notaPre } from '../../templates/doacao';
import { Alert, RefreshControl, View, Share } from 'react-native';
import { footerContainer } from '../login/styles';
import TableDoar from './table';
import { v2 } from '../../services/api';
import { useAuth } from '../../context/auth/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { sorteioColor } from '../../utils/sorteioColors';
import { useSettings } from '../../context/settings';
import moment from 'moment';
import { fontTableTitle, tableTitle, tableTitle2 } from '../../components/Table/styles';
import { useInterval } from '../../utils/useInterval';
import timerSort from './timesort';
import {
  compartilharMsg,
  compartilharMsgNovamente,
  compartilharPreMsg,
  compartilharPreMsgNovamente
} from '../../utils/compartilhar';

const formatSorteioTitle = (data?: SorteioData) => {
  if (data)
    return `${data.tipo_rodada?.split(' ')[0]} #${data.codigo} - ${moment(data.data_partida).format('L - LT')} - ${
      data.valor_keno
    }`;
  else return '';
};

const Doar: React.FC = () => {
  const { deviceInfo, user } = useAuth();
  const { currentPrinter } = usePrinter();
  const { driver } = useSettings();

  // Vem da Api:
  const [sorteios, setSorteios] = useState<SorteioData[]>([]);

  // Controles da tela:
  const [selSortIndex, setSelSortIndex] = useState<number>();
  const [qtdCartelas, setQtdCartelas] = useState<number>(0);

  // Mostrar/Fechar Modais:
  const [cnfImpresaoModal, setCnfImpressaoModal] = useState({ visible: false });
  const [cnfCompraModal, setCnfCompraModal] = useState(false);
  const [cnfCompartilharModal, setCnfCompartilharModal] = useState(false);
  const [cnfCompartilharPreModal, setCnfCompartilharPreModal] = useState(false);
  const [cnfReenvioModal, setCnfReenvioModal] = useState(false);
  const [cnfReenvioPreModal, setCnfReenvioPreModal] = useState(false);
  const [searchValue, setSearchValue] = useState();
  const [cnfPreCompraModal, setCnfPreCompraModal] = useState(false);
  const [cnfPreCompraImpresaoModal, setCnfPreCompraImpresaoModal] = useState({ visible: false });
  const [PreCompraCode, setPreCompraCodeValue] = useState<number>();
  const [PreCompraData, setPreCompraData] = useState<PreCompra>();
  const [count, setcount] = useState(0);

  const [loading, setLoading] = useState(false);
  useInterval(() => {
    setcount(count + 1);
  }, 1000);
  const userInfo = useMemo(
    () =>
      ({
        ...user,
        ...deviceInfo
      } as IUser & DeviceInfo),
    [deviceInfo, user]
  );
  const sorteioSelecionado = useMemo(() => {
    const s = selSortIndex !== undefined && sorteios?.length > 0 ? sorteios[selSortIndex] : undefined;
    if (!s) return s;

    const isAntecipado = moment(s.hora_antecipado).isAfter(s.datahora);
    s.antecipado = isAntecipado;
    s.valor_cartela = isAntecipado ? s.valor_antecipado : s.valor_dia;
    return s;
  }, [sorteios, selSortIndex]);

  const closeModal = useCallback(() => {
    setCnfCompraModal(false);
    setCnfPreCompraModal(false);
    setPreCompraData(undefined); // set precompra data para undefined quando fechar o modal
    setCnfCompartilharModal(false);
    setCnfReenvioModal(false);
    setCnfCompartilharPreModal(false);
    setCnfReenvioPreModal(false);
  }, []);

  const handleApostasEncerradas = useCallback(
    (sorteio: SorteioData | undefined) => {
      Alert.alert(`Sorteio ${sorteio?.codigo}`, 'Apostas Encerradas.');
      closeModal();
      if (!sorteio) return;

      setSorteios(sorteios.filter(({ codigo }) => codigo != sorteio.codigo));
      setSelSortIndex(undefined);
    },
    [closeModal, sorteios]
  );

  const handleCompartilhar = () => {
    setCnfCompraModal(false);
    setCnfCompartilharModal(true);
  };

  const handleCompartilharPre = () => {
    setCnfPreCompraModal(false);
    setCnfCompartilharPreModal(true);
  };

  async function recompartilhar() {
    try {
      const data = JSON.parse((await AsyncStorage.getItem('@GDSK:lastdata')) || 'null');

      if (!data) throw new Error();

      const mensagem = compartilharMsgNovamente(data, userInfo, version);
      await Share.share({
        message: mensagem
      });
    } catch {
      Alert.alert('Erro Interno', 'Tente novamente mais tarde pelo histórico de bilhetes');
    } finally {
      setLoading(false);
    }
  }
  async function recompartilhar_pre() {
    try {
      const data = JSON.parse((await AsyncStorage.getItem('@GDSK:lastdata')) || 'null');

      if (!data) throw new Error();

      const mensagem = compartilharPreMsgNovamente(data, userInfo, version);
      await Share.share({
        message: mensagem
      });
    } catch {
      Alert.alert('Erro Interno', 'Tente novamente mais tarde pelo histórico de bilhetes');
    } finally {
      setLoading(false);
    }
  }
  async function compartilhar() {
    if (!sorteioSelecionado) {
      Alert.alert('Sorteio não selecionado.');
      return;
    }

    if (moment().isAfter(moment(sorteioSelecionado.data_partida).add(15, 'seconds'))) {
      return handleApostasEncerradas(sorteioSelecionado);
    }

    const payload = {
      sorteio: sorteioSelecionado.codigo,
      qtd_cartelas: qtdCartelas
    };

    setLoading(true);

    try {
      const { data } = await v2.post<IBilhete>('/comprar_cartela/', payload);
      if (!data) throw new Error();
      const bilhete = { ...data, sorteio: data.sorteio || payload.sorteio };
      try {
        const mensagem = compartilharMsg(data, userInfo, version);
        await Share.share({
          message: mensagem
        });
      } catch {
        // ignore
      }

      setCnfCompraModal(false); // Desabilitar confirmação de compra
      setCnfCompartilharModal(false);
      setCnfReenvioModal(true);
      mountScreen(true); // Recarregar próximos sorteios

      // Salvar p/ re-impressão
      await AsyncStorage.setItem('@GDSK:lastdata', JSON.stringify(bilhete));
    } catch (err) {
      if (err?.response?.data?.details) alert(err?.response?.data?.details);
      else alert('Erro na doação.');
    } finally {
      setLoading(false);
    }
  }

  async function compartilhar_pre() {
    const payload = {
      codigo: String(PreCompraCode)
    };
    setLoading(true);
    try {
      const { data } = await v2.post<IBilheteLote>('/confimar_pre_compra/', payload);
      closeModal();
      if (!data) throw new Error();
      try {
        const mensagem = compartilharPreMsg(data, userInfo, version);
        await Share.share({
          message: mensagem
        });
      } catch {
        // ignore
      }

      setCnfReenvioPreModal(true);
      mountScreen(true); // Recarregar próximos sorteios

      // Salvar p/ re-envio
      await AsyncStorage.setItem('@GDSK:lastdata', JSON.stringify(data));
    } catch (err) {
      if (err?.response?.data?.details) alert(err?.response?.data?.details);
      else alert('Erro na doação.');
    } finally {
      setLoading(false);
    }
  }

  const mountScreen = useCallback(async (backgroundFetch = false) => {
    if (!backgroundFetch) setLoading(true);

    try {
      const { data } = (await v2.get<SorteioData[]>('/proximos_sorteios/')) || {};
      setSorteios(data);
      setSelSortIndex(0);
    } catch (err) {
      setSelSortIndex(undefined);
      if (err?.response?.data?.details) alert(err?.response?.data?.details);
      else alert('Erro ao buscar sorteios.');
    }
    if (backgroundFetch) return;
    setcount(0);
    setLoading(false);
  }, []);

  useEffect(() => {
    mountScreen();
  }, [mountScreen]);

  const handlePrint = (amount?: number) => {
    if (amount) {
      setQtdCartelas(amount);
    }
    setCnfCompraModal(true);
  };
  const handlePreModal = (value: boolean) => {
    if (PreCompraData) {
      detail_pre(PreCompraData?.codigo);
    }
    setCnfPreCompraModal(value);
  };

  const handleAddCartelas = () => {
    let value = qtdCartelas + 1;
    if (value > 999) value = 999;
    setQtdCartelas(value);
  };

  const handleSubCartelas = () => {
    let value = qtdCartelas - 1;
    if (value < 0) value = 0;
    setQtdCartelas(value);
  };

  const detail_pre = useCallback(async (code = String) => {
    setLoading(true);
    try {
      const { data } = await v2.get<PreCompra>(`/pre_compra_details/${code}/`);
      setPreCompraData(data);
    } catch (err) {
      if (err?.response?.data?.details) alert(err?.response?.data?.details);
      else Alert.alert('', 'Pule já resgatada ou inválida!.');
    } finally {
      setLoading(false);
    }
  }, []);

  const print_pre = useCallback(
    async (code = String) => {
      const payload = {
        codigo: String(code)
      };
      try {
        setLoading(true);
        const { data } = await v2.post<IBilheteLote>('/confimar_pre_compra/', payload);
        closeModal();
        try {
          await notaPre({
            printerType: driver,
            printer: currentPrinter,
            sorteio: data,
            pos: userInfo,
            reimpressao: false
          });
        } catch {
          // Pass
        }
        await AsyncStorage.setItem('@GDSK:lastdata', JSON.stringify(data));
        setCnfPreCompraImpresaoModal({ visible: true });
      } catch {
        Alert.alert('', 'Pule já resgatada ou inválida!.');
      } finally {
        setLoading(false);
      }
    },
    [driver, currentPrinter, userInfo]
  );

  const print_pre_last = useCallback(async () => {
    setLoading(true);

    try {
      const data = JSON.parse((await AsyncStorage.getItem('@GDSK:lastdata')) || 'null');
      if (!data) throw new Error();
      try {
        await notaPre({
          printerType: driver,
          printer: currentPrinter,
          sorteio: data,
          pos: userInfo,
          reimpressao: true
        });
      } catch {
        // Pass
      }
    } catch {
      Alert.alert('Erro Interno', 'Tente novamente mais tarde pelo histórico de bilhetes');
    } finally {
      setLoading(false);
      setCnfImpressaoModal({ visible: false });
    }
  }, [driver, currentPrinter, userInfo]);

  const print = useCallback(async () => {
    if (!sorteioSelecionado) {
      Alert.alert('Sorteio não selecionado.');
      return;
    }

    if (moment().isAfter(moment(sorteioSelecionado.data_partida).add(15, 'seconds'))) {
      return handleApostasEncerradas(sorteioSelecionado);
    }

    const payload = {
      sorteio: sorteioSelecionado.codigo,
      qtd_cartelas: qtdCartelas
    };

    setLoading(true);

    try {
      const { data } = await v2.post<IBilhete>('/comprar_cartela/', payload);
      const bilhete = { ...data, sorteio: data.sorteio || payload.sorteio };
      try {
        await notaDefault({
          printerType: driver,
          printer: currentPrinter,
          sorteio: bilhete,
          pos: userInfo,
          reimpressao: false
        });
      } catch {
        // Ignore
      }

      setCnfCompraModal(false); // Desabilitar confirmação de compra
      setCnfImpressaoModal({ visible: true }); // Habilitar confirmação de impressão
      mountScreen(true); // Recarregar próximos sorteios

      // Salvar p/ re-impressão:
      await AsyncStorage.setItem('@GDSK:lastdata', JSON.stringify(bilhete));
    } catch (err) {
      if (err?.response?.data?.details) alert(err?.response?.data?.details);
      else alert('Erro na doação.');
    } finally {
      setLoading(false);
    }
  }, [sorteioSelecionado, qtdCartelas, handleApostasEncerradas, mountScreen, driver, currentPrinter, userInfo]);

  const printLast = useCallback(async () => {
    setLoading(true);

    try {
      const data = JSON.parse((await AsyncStorage.getItem('@GDSK:lastdata')) || 'null');

      if (!data) throw new Error();

      await notaDefault({
        printerType: driver,
        printer: currentPrinter,
        sorteio: data,
        pos: userInfo,
        reimpressao: true,
        tiny: true
      });
    } catch {
      Alert.alert('Erro Interno', 'Tente novamente mais tarde pelo histórico de bilhetes');
    } finally {
      setLoading(false);
      setCnfImpressaoModal({ visible: true });
    }
  }, [driver, currentPrinter, userInfo]);

  const handleSelect = (sel: IndexPath | IndexPath[]) => {
    const row = Array.isArray(sel) ? sel[0].row : sel.row;

    if (moment().isAfter(moment(sorteios[row].data_partida).add(15, 'seconds'))) {
      return handleApostasEncerradas(sorteios[row]);
    }
    setSelSortIndex(row);
  };

  const handleConfirmar = () => {
    setCnfImpressaoModal({ visible: false });
  };
  const handleCancelarCompartilhamento = () => {
    setCnfCompartilharPreModal(false);
    closeModal();
  };
  const handleConfirmarPre = () => {
    setCnfPreCompraImpresaoModal({ visible: false });
  };

  const handleSearchValue = (event: any) => {
    const { text } = event.nativeEvent;
    setSearchValue(text);
    setSelSortIndex(sorteios.findIndex((val) => val.codigo == text));
  };

  const handleQtdCartelaValue = (event: any) => {
    const { text } = event.nativeEvent;
    setQtdCartelas(Number(text));
  };

  const handlePreValue = (event: any) => {
    const { text } = event.nativeEvent;
    setPreCompraCodeValue(text);
  };

  useEffect(() => {
    // Se tiver search value, busca o index e seta pelo handle select modificado
    if (searchValue) {
      const index = sorteios.findIndex((item) => item.codigo == searchValue);
      if (!index) return;

      setSelSortIndex(index);
    }
  }, [searchValue, sorteios]);

  return (
    <Layout style={main} level={'4'}>
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
            onPress={() => mountScreen()}
            style={button}
          />
        )}
      />
      <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={mountScreen} />}>
        <Layout style={content} level={'4'}>
          <Layout
            style={{
              flex: 0.9,
              padding: 20,
              borderRadius: 15
            }}
          >
            <Input
              placeholder="Digite o código do seu sorteio"
              style={search}
              onChange={handleSearchValue}
              keyboardType="decimal-pad"
            />
            <Button onPress={() => handlePreModal(true)} style={buttonPreCompra}>
              Pré Compra
            </Button>
            {/* @ts-ignore */}
            <select
              value={selSortIndex !== undefined ? selSortIndex : ""}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 5,
                borderColor: '#e4e9f2',
                borderWidth: 1,
                backgroundColor: '#f7f9fc',
                color: '#222b45',
                fontSize: 15,
                marginTop: 10,
                marginBottom: 10
              }}
              onChange={(e: any) => handleSelect({ row: parseInt(e.target.value) } as any)}
            >
              <option value="" disabled>
                {sorteios?.length === 0
                  ? 'Nenhum Sorteio Disponivel'
                  : 'Selecione uma Opção'}
              </option>
              {sorteios && sorteios.map((sorteio, index) => (
                <option key={`std_${sorteio.codigo}`} value={index}>
                  {formatSorteioTitle(sorteio)}
                </option>
              ))}
            {/* @ts-ignore */}
            </select>
            <Text style={campoTempo}>
              <Text style={textCronometro}>Sorteio Começa em: </Text>
              <Text style={cronometroReverso}>
                {sorteios.length > 0 && selSortIndex != undefined && selSortIndex >= 0
                  ? timerSort(
                      new Date(sorteios[selSortIndex || 0].data_partida),
                      new Date(sorteios[selSortIndex || 0].datahora),
                      count,
                      true
                    )
                  : ''}
              </Text>
            </Text>
            <TableDoar selected={sorteioSelecionado} count={count} />
            <Layout style={contador}>
              <Button
                disabled={!sorteioSelecionado}
                onPress={handleSubCartelas}
                style={buttonContador}
                appearance={'ghost'}
              >
                -
              </Button>

              <Input
                style={inputContador}
                maxLength={3}
                value={String(qtdCartelas)}
                onChange={handleQtdCartelaValue}
                keyboardType="decimal-pad"
              />

              <Button
                disabled={!sorteioSelecionado}
                onPress={handleAddCartelas}
                style={buttonContador}
                appearance={'ghost'}
              >
                +
              </Button>

              <View style={[footerContainer]}>
                <Button
                  style={buttonEnviar}
                  disabled={!sorteioSelecionado || loading || !qtdCartelas}
                  onPress={() => handlePrint()}
                  accessoryLeft={() => <Ionicons color="#ffff" name="send" />}
                />
              </View>
            </Layout>
            <Layout style={button1}>
              {[1, 2, 3, 4, 5].map((num) => (
                <Button
                  key={`addnum${num}`}
                  disabled={!sorteioSelecionado}
                  onPress={() => handlePrint(num)}
                  style={button1}
                >
                  {num}
                </Button>
              ))}
            </Layout>
            <Layout style={button2}>
              <Layout style={button2}>
                {[10, 20, 30, 40, 50].map((num) => (
                  <Button
                    key={`addnum${num}`}
                    disabled={!sorteioSelecionado}
                    onPress={() => handlePrint(num)}
                    style={button2}
                  >
                    {num}
                  </Button>
                ))}
              </Layout>
            </Layout>
          </Layout>
        </Layout>
      </ScrollView>
      <Modal
        visible={cnfPreCompraImpresaoModal.visible}
        onDismiss={closeModal}
        contentContainerStyle={backdrop}
        style={{ marginHorizontal: '5%', marginBottom: '10%', width: '90%' }}
      >
        <Layout>
          <Card disabled={true}>
            <Layout style={{ alignItems: 'center' }}>
              <Text category="h5">Confirmar impressão</Text>
              <Divider />
              <Text category="p2">A pule foi impressa corretamente ?</Text>
            </Layout>
            <View style={[footerContainer]}>
              <Button style={button} disabled={loading} onPress={print_pre_last} appearance="ghost">
                Re-imprimir
              </Button>
              <Button style={button} disabled={loading} onPress={handleConfirmarPre}>
                Sim
              </Button>
            </View>
          </Card>
        </Layout>
      </Modal>
      <Modal
        visible={cnfCompartilharModal}
        onDismiss={closeModal}
        contentContainerStyle={backdrop}
        style={{ marginHorizontal: '5%', marginBottom: '10%', width: '90%' }}
      >
        <Layout level={'3'}></Layout>
        <Layout>
          <Card disabled={true}>
            <Layout style={{ alignItems: 'center' }}>
              <Text category="h6">Confirmar Compartilhamento</Text>
              <Divider />
              <Text style={{ marginTop: 5, marginBottom: 10, color: 'red' }} category="p2">
                O bilhete será compartilhado em formato de texto
              </Text>
            </Layout>
            <View style={[footerContainer]}>
              <Button style={button} disabled={loading} onPress={handleCancelarCompartilhamento} appearance="ghost">
                Cancelar
              </Button>
              <Button style={button} disabled={loading} onPress={compartilhar}>
                Compartilhar
              </Button>
            </View>
          </Card>
        </Layout>
      </Modal>
      <Modal
        visible={cnfCompartilharPreModal}
        onDismiss={closeModal}
        contentContainerStyle={backdrop}
        style={{ marginHorizontal: '5%', marginBottom: '10%', width: '90%' }}
      >
        <Layout level={'3'}></Layout>
        <Layout>
          <Card disabled={true}>
            <Layout style={{ alignItems: 'center' }}>
              <Text category="h6">Confirmar Compartilhamento</Text>
              <Divider />
              <Text style={{ marginTop: 5, marginBottom: 10, color: 'red' }} category="p2">
                A pule será compartilhada em formato de texto
              </Text>
            </Layout>
            <View style={[footerContainer]}>
              <Button style={button} disabled={loading} onPress={handleCancelarCompartilhamento} appearance="ghost">
                Cancelar
              </Button>
              <Button style={button} disabled={loading} onPress={compartilhar_pre}>
                Compartilhar
              </Button>
            </View>
          </Card>
        </Layout>
      </Modal>
      <Modal
        visible={cnfReenvioModal}
        contentContainerStyle={backdrop}
        style={{ marginHorizontal: '5%', marginBottom: '10%', width: '90%' }}
      >
        <Layout level={'3'}></Layout>
        <Layout>
          <Card disabled={true}>
            <Layout style={{ alignItems: 'center' }}>
              <Text category="h6">Confirmar Compartilhamento</Text>
              <Divider />
              <Text style={{ marginTop: 5, marginBottom: 10 }} category="p2">
                O bilhete foi compartilhado ?
              </Text>
            </Layout>
            <View style={[footerContainer]}>
              <Button style={button} disabled={loading} onPress={recompartilhar} appearance="ghost">
                Reenviar
              </Button>
              <Button style={button} disabled={loading} onPress={closeModal}>
                Sim
              </Button>
            </View>
          </Card>
        </Layout>
      </Modal>
      <Modal
        visible={cnfReenvioPreModal}
        contentContainerStyle={backdrop}
        style={{ marginHorizontal: '5%', marginBottom: '10%', width: '90%' }}
      >
        <Layout level={'3'}></Layout>
        <Layout>
          <Card disabled={true}>
            <Layout style={{ alignItems: 'center' }}>
              <Text category="h6">Confirmar Compartilhamento</Text>
              <Divider />
              <Text style={{ marginTop: 5, marginBottom: 10 }} category="p2">
                A Pule foi compartilhada ?
              </Text>
            </Layout>
            <View style={[footerContainer]}>
              <Button style={button} disabled={loading} onPress={recompartilhar_pre} appearance="ghost">
                Reenviar
              </Button>
              <Button style={button} disabled={loading} onPress={closeModal}>
                Sim
              </Button>
            </View>
          </Card>
        </Layout>
      </Modal>
      <Modal
        visible={cnfPreCompraModal}
        onDismiss={closeModal}
        contentContainerStyle={backdrop}
        style={{ marginHorizontal: '5%', marginBottom: '10%', width: '90%' }}
      >
        <Layout level={'3'}></Layout>
        <ScrollView>
          <Layout>
            <Text style={{ marginLeft: 60, marginTop: 10, marginBottom: 10, fontWeight: 'bold' }} category="h5">
              Confirmar Pré Compra:
            </Text>
            <Layout style={{ alignItems: 'center' }}>
              <Input
                placeholder="Digite o código da pré compra"
                defaultValue={PreCompraCode ? String(PreCompraCode) : ''}
                style={searchPreCompra}
                onChange={handlePreValue}
                keyboardType="decimal-pad"
              />
              <View style={[footerContainer]}>
                <Button
                  disabled={String(PreCompraCode).length < 9}
                  onPress={() => detail_pre(PreCompraCode)}
                  style={buttonPreCompra}
                >
                  Pesquisar
                </Button>
              </View>
            </Layout>
          </Layout>

          {PreCompraData && (
            <Layout style={{ alignItems: 'center' }}>
              <Text>Valor Total: {PreCompraData.valor_total.toFixed(2)}</Text>
              <Text style={{ marginBottom: 10 }}>Status: {PreCompraData.confirmado ? 'Confirmado' : 'Em espera'}</Text>
              <DataTable>
                <DataTable.Header style={tableTitle}>
                  <DataTable.Title style={{ flex: 0.5 }}>
                    <Text style={fontTableTitle}>Sorteio:</Text>
                  </DataTable.Title>
                  <DataTable.Title numeric>
                    <Text style={fontTableTitle}>Quantidade:</Text>
                  </DataTable.Title>
                  <DataTable.Title numeric>
                    <Text style={fontTableTitle}>Valor:</Text>
                  </DataTable.Title>
                </DataTable.Header>
                <ScrollView>
                  {PreCompraData?.bilhetes?.map((bilhete) => (
                    <DataTable.Row {...{ key: bilhete.sorteio }}>
                      <DataTable.Cell style={{ flex: 0 }}>
                        <Text style={fontTableBodyPreCompra}>{bilhete.sorteio}</Text>
                      </DataTable.Cell>
                      <DataTable.Cell numeric>
                        <Text style={fontTableBodyPreCompra}>{bilhete.qtd_cartelas}</Text>
                      </DataTable.Cell>
                      <DataTable.Cell numeric>
                        <Text style={fontTableBodyPreCompra}>{bilhete.valor_bilhete?.toFixed(2) || ''}</Text>
                      </DataTable.Cell>
                    </DataTable.Row>
                  ))}
                </ScrollView>
              </DataTable>
              <View style={[footerContainer]}>
                <Button
                  style={buttonCompartilharPreCompra}
                  disabled={PreCompraData.confirmado || loading}
                  onPress={() => handleCompartilharPre()}
                  accessoryLeft={() => (
                    <Ionicons
                      style={{
                        fontSize: 25
                      }}
                      color="#ffff"
                      name="share-social-outline"
                    />
                  )}
                />
                <Button
                  style={buttonImprePreCompra}
                  disabled={PreCompraData.confirmado || loading}
                  onPress={() => print_pre(PreCompraCode)}
                  accessoryLeft={() => (
                    <Ionicons
                      style={{
                        fontSize: 25
                      }}
                      color="#ffff"
                      name="print"
                    />
                  )}
                />
              </View>
              {PreCompraData?.bilhetes_invalidos?.length > 0 && (
                <>
                  <Text style={{ marginTop: -15, textAlign: 'center', fontWeight: 'bold' }}>
                    ---------------------------------------------
                  </Text>
                  <DataTable>
                    <Text style={{ textAlign: 'center', marginBottom: 10, fontWeight: 'bold' }}>
                      Sorteios ainda não efetivados e/ou cancelados:
                    </Text>
                    <DataTable.Header style={tableTitle2}>
                      <DataTable.Title style={{ flex: 0.5 }}>
                        <Text style={fontTableTitle}>Sorteio:</Text>
                      </DataTable.Title>
                      <DataTable.Title numeric>
                        <Text style={fontTableTitle}>Quantidade:</Text>
                      </DataTable.Title>
                      <DataTable.Title numeric>
                        <Text style={fontTableTitle}>Valor:</Text>
                      </DataTable.Title>
                    </DataTable.Header>
                    <ScrollView>
                      {PreCompraData?.bilhetes_invalidos?.map((bilhete) => (
                        <DataTable.Row {...{ key: bilhete.sorteio }}>
                          <DataTable.Cell style={{ flex: 0 }}>
                            <Text style={fontTableBodyPreCompra}>{bilhete.sorteio}</Text>
                          </DataTable.Cell>
                          <DataTable.Cell numeric>
                            <Text style={fontTableBodyPreCompra}>{bilhete.qtd_cartelas}</Text>
                          </DataTable.Cell>
                          <DataTable.Cell numeric>
                            <Text style={fontTableBodyPreCompra}>{bilhete.valor_bilhete?.toFixed(2) || ''}</Text>
                          </DataTable.Cell>
                        </DataTable.Row>
                      ))}
                    </ScrollView>
                  </DataTable>
                </>
              )}
            </Layout>
          )}
        </ScrollView>
      </Modal>

      <Modal
        visible={cnfCompraModal}
        onDismiss={closeModal}
        contentContainerStyle={backdrop}
        style={{ marginHorizontal: '5%', marginBottom: '10%', width: '90%' }}
      >
        <Layout level={'3'}></Layout>
        <Layout>
          <Card disabled={true}>
            <Layout style={{ alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold' }} category="h4">
                Confirmar Doação:
              </Text>
              <Divider />
              <TableDoar selected={sorteioSelecionado} count={count} />
              <Divider />
              <Text style={{ marginBottom: 5, marginTop: 10 }} category="p2">
                Total de Cartelas: {qtdCartelas}
              </Text>
              <Text style={{ marginBottom: 5, fontWeight: 'bold' }} category="h5">
                Valor da Doação: {((sorteioSelecionado?.valor_cartela || 0) * qtdCartelas).toFixed(2)}
              </Text>
              <Text style={{ color: 'red', fontWeight: 'bold', marginBottom: 15, textAlign: 'center' }}>
                Não é possível cancelar cartelas após compartilhamento ou impressão !
              </Text>
            </Layout>
            <View style={[footerContainer]}>
              <Button style={buttonCancelar} disabled={loading} onPress={closeModal} appearance="ghost">
                Cancelar
              </Button>

              {/*botão compartilhar */}
              <Button
                style={buttonCompartilhar}
                disabled={loading}
                onPress={handleCompartilhar}
                accessoryLeft={() => (
                  <Ionicons
                    style={{
                      fontSize: 25
                    }}
                    color="#fff"
                    name="share-social-outline"
                  />
                )}
              />

              {/* botão imprimir */}
              <Button
                style={button}
                disabled={loading}
                onPress={print}
                accessoryLeft={() => (
                  <Ionicons
                    style={{
                      fontSize: 25
                    }}
                    color="#fff"
                    name="print"
                  />
                )}
              />
            </View>
          </Card>
        </Layout>
      </Modal>
      <Modal
        visible={cnfImpresaoModal.visible}
        onDismiss={closeModal}
        contentContainerStyle={backdrop}
        style={{ marginHorizontal: '5%', marginBottom: '10%', width: '90%' }}
      >
        <Layout level={'3'}></Layout>
        <Layout>
          <Card disabled={true}>
            <Layout style={{ alignItems: 'center' }}>
              <Text category="h5">Confirmar impressão</Text>
              <Divider />
              <Text style={{}} category="p2">
                O bilhete foi impresso corretamente?
              </Text>
            </Layout>
            <View style={[footerContainer]}>
              <Button style={button} disabled={loading} onPress={printLast} appearance="ghost">
                Re-imprimir
              </Button>
              <Button style={button} disabled={loading} onPress={handleConfirmar}>
                Sim
              </Button>
            </View>
          </Card>
        </Layout>
      </Modal>
    </Layout>
  );
};

export default Doar;
