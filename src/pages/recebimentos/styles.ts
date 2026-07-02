import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  main: {
    display: 'flex',
    height: '100%'
  },

  title: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },

  textCenter: {
    width: '100%',
    backgroundColor: '#203247',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#ffffff',
    borderBottomColor: '#203247'
  },

  textCenter2: {
    width: '100%',
    backgroundColor: '#ffc107',
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black', // Cor da Fonte (letras)
    borderBottomColor: '#203247'
  },

  textCenter3: {
    width: '100%',
    backgroundColor: '#28a745',
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white', // Cor da Fonte (letras)
    borderBottomColor: '#203247'
  },

  textSaldo: {
    fontSize: 14,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
    padding: 5,
    backgroundColor: '#e3e3e3'
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 15
  },

  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    textAlignVertical: 'center',
    textAlign: 'center'
  },

  button: {
    marginHorizontal: 5,
    paddingHorizontal: 10,
    paddingVertical: 7
  },

  buttonSolicitacao: {
    marginHorizontal: 5,
    paddingVertical: 7
  },

  iconBtn: {
    fontSize: 20
  },

  search: {
    width: '35%',
    marginTop: 2
  },

  containerBtn: {
    marginTop: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },

  btn: {
    paddingHorizontal: 15,
    paddingVertical: 5
  },

  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
});

export default styles;

const { content, main, buttonRow, button, title, textCenter, textCenter2, textCenter3, iconBtn, search, btn, containerBtn, textSaldo, backdrop, buttonSolicitacao } = styles;
export { content, main, buttonRow, button, title, textCenter, textCenter2, textCenter3, iconBtn, search, btn, containerBtn, textSaldo, backdrop, buttonSolicitacao };
