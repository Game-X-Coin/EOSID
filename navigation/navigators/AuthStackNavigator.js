import React from 'react';
import { inject, observer } from 'mobx-react';
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

@inject('userStore')
@observer
class AuthStackNavigatorWrapper extends React.Component {
  componentDidMount() {
    if (this.props.userStore.users.length) {
      this.props.navigation.replace('SignIn');
    }
  }

  render() {
    return <AuthStackNavigator navigation={this.props.navigation} />;
  }
}

AuthStackNavigatorWrapper.router = AuthStackNavigator.router;

export { AuthStackNavigatorWrapper as AuthStackNavigator };
