import { createSwitchNavigator } from 'react-navigation';

import { WelcomeScreen } from '../../screens/Auth';

import { ImportAccountScreen, ConfirmAppPinScreen } from '../../screens/Shared';

export const AuthSwitchNavigator = createSwitchNavigator(
  {
    Welcome: WelcomeScreen,
    ConfirmAppPin: ConfirmAppPinScreen,
    ImportAccount: ImportAccountScreen
  },
  {
    headerMode: 'none',
    cardStyle: { backgroundColor: '#fff' }
  }
);
