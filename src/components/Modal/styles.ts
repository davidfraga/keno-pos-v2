import { StatusBar, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  main: {
    padding: 25,
    paddingTop: 0,
    height: '100%',
    display: 'flex'
  },
  content: {
    flex: 1,
    flexDirection: 'column',

    marginTop: StatusBar.currentHeight,
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    textAlignVertical: 'center',
    textAlign: 'center'
  },
  tinyLogo: {
    width: 120,
    height: 120,
    marginBottom: 25
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  footerControl: {
    marginHorizontal: 2
  },
  textHolder: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default styles;

const {
  content,
  main,
  tinyLogo,
  backdrop,
  footerContainer,
  footerControl,
  textHolder
} = styles;
export {
  content,
  main,
  tinyLogo,
  backdrop,
  footerControl,
  textHolder,
  footerContainer
};
