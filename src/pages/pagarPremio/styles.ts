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
    marginBottom: 5,
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

  layoutPagar: {
    flexDirection: 'row',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20
  },

  button: {
    marginHorizontal: 5,
    paddingHorizontal: 15,
    paddingVertical: 7,
    marginBottom: 5,
  },

  buttonPagar: {
    // marginHorizontal: 5,
    // paddingHorizontal: 15,
    paddingVertical: 7,
    // marginBottom: 5,
    backgroundColor:'green',
    borderColor: 'green'
  },


  iconBtn: {
    fontSize: 20,
  },

  search: {
    width: '75%',
    marginBottom: 5
  }
});

export default styles;

const { main, textCenter, buttonRow, layoutPagar, button, buttonPagar, search, title, iconBtn } = styles;
export { main, textCenter, buttonRow, layoutPagar, button, buttonPagar, search, title, iconBtn };
