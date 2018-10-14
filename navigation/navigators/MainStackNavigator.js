import React from 'react';
import { View } from 'react-native';
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
  ConfirmPinScreen
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
  ConfirmPin: ConfirmPinScreen
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

export const MainStackNavigator = createStackNavigator(
  {
    MainTab: MainTabNavigator,
    ...DetailScreens
  },
  {
    headerMode: 'none',
    cardStyle: { backgroundColor: '#fff' }
  }
);
