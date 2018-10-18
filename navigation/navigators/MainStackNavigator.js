import React from 'react';
import { observer, inject } from 'mobx-react';
import { createStackNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { Icon } from 'expo';

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
  Account: 'md-contact',
  Transaction: 'md-filing',
  Settings: 'md-settings'
};

// tab navigator
const MainTabNavigator = createMaterialBottomTabNavigator(
  {
    Account: AccountScreen,
    Transaction: TransactionScreen,
    Settings: SettingsScreen
  },
  {
    shifting: true,
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ tintColor }) => {
        const { routeName } = navigation.state;

        return (
          <Icon.Ionicons
            size={26}
            name={iconMap[routeName]}
            color={tintColor}
          />
        );
      }
    })
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
