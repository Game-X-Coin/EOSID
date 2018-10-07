import { createSwitchNavigator } from 'react-navigation';

import { AuthStackNavigator, MainStackNavigator } from './navigators';

export default createSwitchNavigator({
  Auth: AuthStackNavigator,
  Main: MainStackNavigator
});
