import { LinearGradient } from 'expo';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  tableTitle: {
    backgroundColor: '#203247',
    overflow: 'visible',
    flexWrap: `wrap-reverse`
  },

  tableTitleSituacao: {
    backgroundColor: '#021b2b',
    overflow: 'visible',
    flexWrap: `wrap-reverse`
  },

  tableTitle2: {
    backgroundColor: 'red',
    overflow: 'visible',
    flexWrap: `wrap-reverse`
  },

  fontTableTitle: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'left',
    overflow: 'visible'
  },

  fontTableTitleSituacao: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center',
    textAlign: 'center',
    overflow: 'visible'
  },
  
  fontTableBody: {
    color: '#203247',
    fontWeight: '600',
    textAlign: 'left',
    overflow: 'visible'
  }
});

export default styles;

const { tableTitle, tableTitleSituacao, tableTitle2, fontTableTitle, fontTableTitleSituacao, fontTableBody } = styles;
export { tableTitle, tableTitleSituacao, tableTitle2, fontTableTitle, fontTableTitleSituacao, fontTableBody };
