import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  main: {
    display: 'flex',
    height: '100%'
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 15
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
  }
});

export default styles;

const { main, textCenter, buttonRow, button, search, title, iconBtn } = styles;
export { main, textCenter, buttonRow, button, search, title, iconBtn };
