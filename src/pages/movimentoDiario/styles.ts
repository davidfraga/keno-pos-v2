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
    marginRight: 10,
    paddingHorizontal: 15,
    paddingVertical: 7
  },

  datePicker: {
    width: '90%',
    marginTop: 2,
    backgroundColor: '#f1f1f1',
    borderColor: '#d1d1d1'
  },

  dpHolder: {
    marginRight: 3,
    marginTop: -20,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },

  iconBtn: {
    fontSize: 20
  }
});

export default styles;

const { main, textCenter, buttonRow, button, datePicker, title, iconBtn, dpHolder } = styles;
export { main, textCenter, buttonRow, button, datePicker, title, iconBtn, dpHolder };
