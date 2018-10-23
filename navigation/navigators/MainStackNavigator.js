import React from 'react';
import { observer, inject } from 'mobx-react';
import { createStackNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { Icon } from 'expo';

import {
  AccountScreen,
  SettingsScreen,
  AddNetworkScreen,
  NetworkScreen as SettingsNetworkScreen,
  TransactionScreen,
  TransactionDetailScreen,
  AccountsScreen,
  TransferScreen,
  ConfirmPinScreen,
  PermissionRequestScreen,
  ManageResourceScreen
} from '../../screens/Main';

import { ImportAccountScreen } from '../../screens/Shared';

// detail screens
const DetailScreens = {
  // accounts
  ImportAccount: ImportAccountScreen,
  Transfer: TransferScreen,
  ManageResource: ManageResourceScreen,
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
