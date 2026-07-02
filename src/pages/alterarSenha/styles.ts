import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  main: {
    display: 'flex',
    height: '100%',
    paddingTop: 8
  },

  title: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
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

  buttonRow: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 15
  },

  button: {
    marginTop: 8,
    marginHorizontal: 5,
    paddingHorizontal: 15,
    paddingVertical: 7
  },

  iconBtn: {
    fontSize: 20
  },

  search: {
    width: '70%',
    marginTop: 2
  }
});

export default styles;

const { main, textCenter, title, buttonRow, button, search } = styles;
export { main, textCenter, title, buttonRow, button, search };
