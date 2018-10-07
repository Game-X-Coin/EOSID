import { createStackNavigator } from 'react-navigation';

import { WelcomeScreen, SignInScreen, SignUpScreen } from '../../screens/Auth';

export const AuthStackNavigator = createStackNavigator(
  {
    Welcome: WelcomeScreen,
    SignIn: SignInScreen,
    SignUp: SignUpScreen
  },
  {
    headerMode: 'none',
    cardStyle: { backgroundColor: '#fff' }
  }
);
