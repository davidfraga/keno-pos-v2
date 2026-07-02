import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Button, Input, Layout, Text, Card } from '@ui-kitten/components';
import { main, buttonRow, button, textCenter, search, title, iconBtn, buttonPagar, layoutPagar } from './styles';
import {
  tableTitle,
  fontTableTitle,
  fontTableBody,
  fontTableTitleSituacao,
  tableTitleSituacao
} from '../../components/Table/styles';
import { ActivityIndicator, DataTable, Modal } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { v2, v3, v5 } from '../../services/api';
import { useRoute } from '@react-navigation/native';
// import { usePrinter } from '../../context/printer';
// import { printVencedores } from '../../templates/vencedores';
import { useAuth } from '../../context/auth/auth';
import Header from '../../components/Header';
import { ScrollView } from 'react-native-gesture-handler';
import { Keyboard, Alert, TouchableWithoutFeedback } from 'react-native';
import { useSettings } from '../../context/settings';
import moment from 'moment';

// import { useSettings } from '../../context/settings';

export const Ganhadores = () => {
  const [modal, showModal] = useState(false);
  const [recebimentos, setRecebimentos] = useState<IRecebimentos>();
  const [vencData, setVencedoresData] = useState<VencedoresData>();
  const [sorteio, setSorteio] = useState<string>();
  const [codigoBilhete, setCodigoBilhete] = useState<string>();
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const [vendedor_senha, setSenha] = useState('');
  const { serverName } = useSettings();
  const [qtdRecebida, setQtdRecebida] = useState('');
  const { user, deviceInfo } = useAuth();
  const [isSecured, setSecured] = useState<boolean>(true);
  const [cartela, setCartela] = useState<IBilhetePremiado>();
  const [totalPremiacao, setTotalPremiacao] = useState('');
  const [dataAtual, setDataAtual] = useState<Date>(new Date());

  useEffect(() => {
    setVencedoresData(undefined);
    setSorteio('');
  }, [route]);

  const needRestart = useMemo(() => {
    if (!recebimentos) return false;

    const limite = moment(recebimentos.datahora).add(4, 'minutes');
    const atual = moment(dataAtual);
    return atual.isAfter(limite);
  }, [recebimentos, dataAtual]);

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

  const handlePagar = useCallback(async () => {
    if (!vendedor_senha) {
      return Alert.alert('Senha Inválida!', 'Informe a senha correta para prosseguir.');
    }
    Keyboard.dismiss();
    setLoading(true);
    try {
      const response = await v2.post('/pagar_premio/', {
        senha: vendedor_senha
      });
      alert(response.data.detail);

      showModal(false);
      setCodigoBilhete(codigoBilhete);
      setSenha('');
    } catch (err: any) {
      console.log(err);
      if (err?.response?.data?.detail) alert(err?.response?.data?.detail);
      else alert('Erro Interno');
    }

    setLoading(false);
  }, [vendedor_senha]);

  const handleOpenModal = useCallback(() => {
    if (needRestart) {
      mountScreen();
      return;
    }
    // if (!codigoBilhete) return;
    if (!codigoBilhete) return Alert.alert('Código inválido', 'informe um bilhete premiado válido!');

    // const number = Number.parseFloat(qtdRecebida);
    // if (recebimentos.saldoLiquido < 0 && number > 0) {
    //   setTipo('A');
    // } else {
    //   setTipo('T');
    // }

    Keyboard.dismiss();
    showModal(true);
  }, [needRestart, codigoBilhete, mountScreen]);

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

  const handleCloseModal = useCallback(() => {
    showModal(false);
    setSenha('');
  }, []);

  const handleVerifBilhete = async (
    bilhete?: string,
    VencedoresData?: VencedoresData,
    cartelaVencedora?: CartelaVencedora
  ) => {
    cartelaVencedora ? {} : Alert.alert('Bilhete Não premiado!', 'Por favor, informe um bilhete premiado.');
    try {
      const res = await v2.get<IBilhetePremiado>(`consulta_premio/${bilhete}/`);
      console.log(res.data);
      setCartela(res.data);
      let totalPremiacao = 0;
      res.data.bilhetes.map((bilhete) => bilhete.cartelas.map((val) => (totalPremiacao += val.valor)));
      setTotalPremiacao(totalPremiacao);
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <Layout style={main}>
      <Header />
      <Layout style={title}>
        <Text style={textCenter} category="h4">
          Pagar Prêmio:
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
          onChangeText={setCodigoBilhete}
          value={codigoBilhete?.replace('.', '').replace(',', '').replace(' ', '').replace('-', '')}
          maxLength={10}
          keyboardType="decimal-pad"
          placeholder="Digite o número do bilhete vencedor"
        />
        <Button
          style={button}
          disabled={String(codigoBilhete).length < 10}
          onPress={() => {
            handleVerifBilhete(codigoBilhete);
          }}
          accessoryLeft={() => <Ionicons style={iconBtn} color="#ffff" name="search-outline" />}
        />
      </Layout>
      <Layout>
        <DataTable>
          <DataTable.Header style={tableTitle}>
            <DataTable.Title style={{ flex: 1.5 }}>
              <Text style={fontTableTitle}>Estabelecimento:</Text>
            </DataTable.Title>
            <DataTable.Title numeric style={{}}>
              <Text style={fontTableTitle}>Tipo de Prêmio:</Text>
            </DataTable.Title>
            <DataTable.Title numeric style={{ paddingRight: '5%' }}>
              <Text style={fontTableTitle}>Premiação:</Text>
            </DataTable.Title>
          </DataTable.Header>
          <ScrollView />
          {cartela?.bilhetes.map((bilhete, index) =>
            bilhete.cartelas.map((cart) => (
              <DataTable.Row key={`${index + cart.tipo_premio}`}>
                <DataTable.Cell style={{ flex: 1.5 }}>
                  <Text style={fontTableBody}>{cartela.estabelecimento}</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={fontTableBody}>{cart.tipo_premio}</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={fontTableBody}>{cart.valor}</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={fontTableBody}></Text>
                </DataTable.Cell>
              </DataTable.Row>
            ))
          )}
        </DataTable>

        {cartela?.bilhetes.map(() => (
          <DataTable.Header style={[tableTitle, { backgroundColor: '#ccc', opacity: 0.9 }]}>
            <DataTable.Title style={{ flex: 0.6 }}>
              <Text style={[fontTableTitle, { color: '#111', fontSize: 20 }]}>Total:</Text>
            </DataTable.Title>

            <DataTable.Title numeric style={{ flex: 0.7, marginRight: 20 }}>
              <Text style={[fontTableTitle, { color: '#111', fontSize: 15, fontWeight: 'bold' }]}>
                {cartela.quantidade_premio}
              </Text>
            </DataTable.Title>

            <DataTable.Title numeric style={{ flex: 0.7, marginRight: 50 }}>
              <Text style={[fontTableTitle, { color: 'green', fontSize: 15, fontWeight: 'bold' }]}>
                {cartela.total_premio}
              </Text>
            </DataTable.Title>
          </DataTable.Header>
        ))}
      </Layout>
      <DataTable style={{ marginTop: 50 }}>
        <DataTable.Header style={tableTitleSituacao}>
          <DataTable.Title style={{ position: 'absolute', marginLeft: '23%' }}>
            <Text style={fontTableTitleSituacao}>Situação do Pagamento:</Text>
          </DataTable.Title>
        </DataTable.Header>

        <Card disabled={true}>
          <DataTable.Header
            style={[
              tableTitleSituacao,
              { backgroundColor: '#ffc107', display: 'flex', justifyContent: 'center', alignItems: 'center' }
            ]}
          >
            <Text style={[fontTableTitleSituacao, { color: 'black', marginBottom: 20 }]}>AGUARDANDO PAGAMENTO...</Text>
          </DataTable.Header>
        </Card>

        <Card disabled={true}>
          <DataTable.Header
            style={[
              tableTitleSituacao,
              { backgroundColor: '#28a745', display: 'flex', justifyContent: 'center', alignItems: 'center' }
            ]}
          >
            <Text style={[fontTableTitleSituacao, { marginBottom: 20 }]}>PREMIAÇÃO PAGA !</Text>
          </DataTable.Header>
        </Card>
      </DataTable>

      <Modal visible={modal} onDismiss={handleCloseModal} style={{ width: '75%', marginHorizontal: '12%' }}>
        <Layout>
          <Card style={{ display: 'flex', alignSelf: 'center', padding: 20 }}>
            <Text category="p1" style={{ textAlign: 'center' }}>
              Código do bilhete: {Number.parseFloat(codigoBilhete || '0').toString()}
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
              <Button disabled={loading} onPress={handlePagar} style={{ marginTop: 20 }}>
                Confirmar
              </Button>
            </Layout>
          </Card>
        </Layout>
      </Modal>
      <Layout style={layoutPagar}>
        <Button
          style={buttonPagar}
          onPress={handleOpenModal}
          disabled={String(codigoBilhete).length < 10}
          accessoryLeft={() => <Ionicons style={iconBtn} color="#ffff" name="cash-outline" />}
        >
          PAGAR
        </Button>
      </Layout>
    </Layout>
  );
};

export default Ganhadores;
