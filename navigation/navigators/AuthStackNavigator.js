import { createStackNavigator } from 'react-navigation';

import { WelcomeScreen, SignInScreen, SignUpScreen } from '../../screens/Auth';

export const AuthStackNavigator = createStackNavigator(
  {
    Welcome: { screen: WelcomeScreen },
    SignIn: { screen: SignInScreen },
    SignUp: { screen: SignUpScreen }
  },
  {
    headerMode: 'none'
  }
);
