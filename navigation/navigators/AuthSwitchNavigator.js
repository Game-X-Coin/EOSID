import { createSwitchNavigator } from 'react-navigation';

import { WelcomeScreen } from '../../screens/Auth';

export const AuthSwitchNavigator = createSwitchNavigator(
  {
    Welcome: WelcomeScreen
  },
  {
    headerMode: 'none',
    cardStyle: { backgroundColor: '#fff' }
  }
);
