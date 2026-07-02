import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  main: {
    height: '100%',
    display: 'flex'
  },

  campoTempo: {
    textAlign: 'center',
    marginTop: 10
  },

  textCronometro: {
    fontSize: 14
  },

  cronometroReverso: {
    marginTop: 10,
    color: 'green',
    fontWeight: 'bold',
    fontSize: 17
  },

  cronometroAntecipadoReverso: {
    marginTop: 10,
    color: 'green',
    fontWeight: 'bold',
    fontSize: 19
  },

  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5
  },

  button: {
    marginHorizontal: 2
  },

  buttonCompartilhar: {
    marginHorizontal: 2,
    marginLeft: 60
  },

  buttonCancelar: {
    marginRight: 30,
    marginLeft: 0,
    marginHorizontal: 2,
    color: 'red',
    fontWeight: 'bold'
  },

  buttonImprePreCompra: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 5
  },

  buttonCompartilharPreCompra: {
    marginTop: 10,
    marginBottom: 10,
    marginRight: 5
  },

  buttonEnviar: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row'
  },

  button1: {
    marginHorizontal: 7,
    justifyContent: 'center',
    flexDirection: 'row',
    display: 'flex'
  },

  button2: {
    marginHorizontal: 2,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5
  },

  contador: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 10
  },

  buttonContador: {
    alignContent: 'center',
    marginHorizontal: 10,
    marginVertical: 6,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    fontWeight: 'bold',
    borderColor: 'blue'
  },

  inputContador: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 6,
    width: 80,
    alignContent: 'center',
    justifyContent: 'center',
    borderColor: 'blue',
  },

  buttonPesquisa: {
    marginHorizontal: 2,
    marginBottom: 10
  },

  buttonPreCompra: {
    marginBottom: 10
  },

  container: {
    minHeight: 192
  },

  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },

  content: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    textAlignVertical: 'center',
    textAlign: 'center'
  },

  search: {
    width: '100%',
    marginBottom: 10
  },

  searchPreCompra: {
    width: '90%',
    marginBottom: 10
  },

  fontTableBodyPreCompra: {
    color: '#203247',
    fontWeight: '600',
    textAlign: 'center',
    overflow: 'visible'
  }
});

const {
  backdrop,
  campoTempo,
  cronometroReverso,
  textCronometro,
  button,
  buttonCompartilhar,
  buttonCancelar,
  button1,
  button2,
  contador,
  buttonContador,
  buttonEnviar,
  inputContador,
  buttonPreCompra,
  buttonRow,
  container,
  content,
  main,
  search,
  searchPreCompra,
  buttonPesquisa,
  buttonImprePreCompra,
  buttonCompartilharPreCompra,
  fontTableBodyPreCompra,
  cronometroAntecipadoReverso
} = styles;

export {
  backdrop,
  campoTempo,
  cronometroReverso,
  textCronometro,
  button,
  contador,
  buttonCompartilhar,
  buttonCancelar,
  button1,
  button2,
  buttonContador,
  buttonEnviar,
  inputContador,
  buttonPreCompra,
  buttonRow,
  container,
  content,
  main,
  search,
  searchPreCompra,
  buttonPesquisa,
  buttonImprePreCompra,
  buttonCompartilharPreCompra,
  fontTableBodyPreCompra,
  cronometroAntecipadoReverso
};
