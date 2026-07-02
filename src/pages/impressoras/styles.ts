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
    marginBottom: 10
  },

  textCenter: {
    width: '100%',
    backgroundColor: '#203247',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#ffffff',
    borderBottomColor: '#203247',
    borderBottomWidth: 2
  },

  textSaldo: {
    fontSize: 13,
    fontWeight: 'bold'
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 15
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
    paddingHorizontal: 15,
    paddingVertical: 7
  },

  iconBtn: {
    fontSize: 20
  },

  search: {
    width: '50%',
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
  }
});

export default styles;

const { content, main, buttonRow, button, title, textCenter, iconBtn, search, btn, containerBtn, textSaldo } = styles;
export { content, main, buttonRow, button, title, textCenter, iconBtn, search, btn, containerBtn, textSaldo };
