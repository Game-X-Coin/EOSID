import { createSwitchNavigator } from 'react-navigation';

import { AuthSwitchNavigator, MainStackNavigator } from './navigators';

export default createSwitchNavigator({
  Auth: AuthSwitchNavigator,
  Main: MainStackNavigator
});
