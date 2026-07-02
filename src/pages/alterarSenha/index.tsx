import React, { useState } from 'react';
import { Button, Input, Layout, Text, CheckBox } from '@ui-kitten/components';
import { main, buttonRow, button, textCenter, search, title } from './styles';
import Header from '../../components/Header';
import { v2 } from '../../services/api';
import { Alert } from 'react-native';
import { useSettings } from '../../context/settings';

const AlterarSenha = () => {
  const [isSecured, setSecured] = useState<boolean>(true);
  const [novaSenha, setNovaSenha] = useState<string>('');
  const [novaSenhaConfirmacao, setNovaSenhaConfirmacao] = useState<string>('');
  const [senhaAtual, setSenhaAtual] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { serverName } = useSettings();

  const handleToggle = () => setSecured(!isSecured);
  const handleSetNovaSenha = (text: string) => setNovaSenha(text);
  const handleSetSenhaAtual = (text: string) => setSenhaAtual(text);
  const handleSetNovaSenhaConfirmacao = (text: string) => setNovaSenhaConfirmacao(text);

  const handleChangePassword = async () => {
    if (novaSenhaConfirmacao !== novaSenha) {
      Alert.alert(serverName, 'A senha não está igual a confirmação!');
      return;
    }

    setLoading(true);
    try {
      await v2.post('/mudar_senha/', {
        senha_atual: senhaAtual,
        nova_senha: novaSenha
      });
      Alert.alert(serverName, 'Senha alterada com sucesso!');
    } catch (err) {
      if (err?.response?.data?.details) alert(err?.response?.data?.details);
      else Alert.alert(serverName, 'Erro Interno, tente novamente mais tarde!');
    }
    setLoading(false);
    handleSetNovaSenha('');
    handleSetSenhaAtual('');
    handleSetNovaSenhaConfirmacao('');
  };

  return (
    <Layout style={main}>
      <Header />
      <Layout style={title}>
        <Text style={textCenter} category="h4">
          Alterar Senha:
        </Text>
      </Layout>
      <Layout style={buttonRow}>
        <Input
          style={search}
          value={senhaAtual}
          onChangeText={handleSetSenhaAtual}
          autoCapitalize="none"
          placeholder="Senha Atual"
          textContentType="password"
          autoComplete="off"
          autoCorrect={false}
          contextMenuHidden={true}
          secureTextEntry={isSecured}
        />
        <Input
          style={search}
          value={novaSenha}
          onChangeText={handleSetNovaSenha}
          autoCapitalize="none"
          placeholder="Nova Senha"
          autoComplete="off"
          autoCorrect={false}
          contextMenuHidden={true}
          textContentType="password"
          secureTextEntry={isSecured}
        />
        <Input
          style={search}
          value={novaSenhaConfirmacao}
          onChangeText={handleSetNovaSenhaConfirmacao}
          autoCapitalize="none"
          placeholder="Confirmar Nova Senha"
          autoComplete="off"
          autoCorrect={false}
          contextMenuHidden={true}
          secureTextEntry={isSecured}
        />
        <Layout style={{ marginVertical: 10, flexDirection: 'row' }}>
          <CheckBox checked={!isSecured} onChange={handleToggle}>
            Visualizar Senhas.
          </CheckBox>
        </Layout>
        <Button disabled={loading} onPress={handleChangePassword} style={button}>
          Confimar
        </Button>
      </Layout>
    </Layout>
  );
};

export default AlterarSenha;
