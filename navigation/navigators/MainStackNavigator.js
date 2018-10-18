import React from 'react';
import { observer, inject } from 'mobx-react';
import {
  createStackNavigator,
  createBottomTabNavigator
} from 'react-navigation';

import { NavigationTabBarIcon } from '../../components/TabBarIcon';

import { TransactionScreen } from '../../screens';

import {
  AccountScreen,
  AddAccountScreen,
  SettingsScreen,
  AddNetworkScreen,
  NetworkScreen as SettingsNetworkScreen,
  TransactionDetailScreen,
  AccountsScreen,
  TransferScreen,
  ConfirmPinScreen,
  PermissionRequestScreen
} from '../../screens/Main';

// detail screens
const DetailScreens = {
  // accounts
  AddAccount: AddAccountScreen,
  Transfer: TransferScreen,

  // settings
  SettingsNetwork: SettingsNetworkScreen,
  AddNetwork: AddNetworkScreen,
  Accounts: AccountsScreen,
  // tx
  TransactionDetail: TransactionDetailScreen,
  // confirm pincode
  ConfirmPin: ConfirmPinScreen,
  // confirm dapp sign
  PermissionRequest: PermissionRequestScreen
};

// for tab icons
const iconMap = {
  Account: 'contact',
  Transaction: 'albums',
  Settings: 'settings'
};

// tab navigator
const MainTabNavigator = createBottomTabNavigator(
  {
    Account: AccountScreen,
    Transaction: TransactionScreen,
    Settings: SettingsScreen
  },
  {
    navigationOptions: ({ navigation }) => ({
      // title: translate(`navigation.${navigation.state.routeName}`),
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;

        return (
          <NavigationTabBarIcon name={iconMap[routeName]} focused={focused} />
        );
      }
    }),
    tabBarOptions: {
      style: {
        height: 57
      },
      labelStyle: {
        paddingBottom: 5
      }
    }
  }
);

@inject('accountStore')
@observer
class MainTabNavigatorWrapper extends React.Component {
  componentDidMount() {
    this.props.accountStore.getAccountInfo();
  }

  render() {
    return <MainTabNavigator navigation={this.props.navigation} />;
  }
}

MainTabNavigatorWrapper.router = MainTabNavigator.router;

export const MainStackNavigator = createStackNavigator(
  {
    MainTab: MainTabNavigatorWrapper,
    ...DetailScreens
  },
  {
    headerMode: 'none',
    cardStyle: { backgroundColor: '#fff' }
  }
);
