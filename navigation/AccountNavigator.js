import { createStackNavigator } from 'react-navigation';

import AddAccountScreen from '../screens/Account/AddAccountScreen';

export default createStackNavigator({
  AddAccount: { screen: AddAccountScreen }
});
