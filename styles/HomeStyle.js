import { StyleSheet } from 'react-native';
import { Theme } from '../constants';

const styles = {
  container: {
    flex: 1,
    backgroundColor: Theme.mainBackgroundColor
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0, 0, 0, 0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center'
  },
  contentContainer: {
    paddingTop: 30
  }
};

export default StyleSheet.create(styles);
