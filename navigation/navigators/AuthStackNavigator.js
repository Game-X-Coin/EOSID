import { createStackNavigator } from 'react-navigation';

import { WelcomeScreen, SignInScreen, SignUpScreen } from '../../screens/Auth';

import { ImportAccountScreen } from '../../screens/Shared';

const AuthStackNavigator = createStackNavigator(
  {
    Welcome: WelcomeScreen,
    SignIn: SignInScreen,
    SignUp: SignUpScreen,
    ImportAccount: ImportAccountScreen
  },
  {
    headerMode: 'none',
    cardStyle: { backgroundColor: '#fff' }
  }
);

export { AuthStackNavigator };
