import React from 'react';
import {
  createStackNavigator,
  createBottomTabNavigator
} from 'react-navigation';

import { NavigationTabBarIcon } from '../../components/TabBarIcon';

import { TransactionScreen, NetworkScreen } from '../../screens';

import {
  AccountScreen,
  AddAccountScreen,
  SettingsScreen,
  AddNetworkScreen,
  NetworkScreen as SettingsNetworkScreen
} from '../../screens/Main';

// detail screens
const DetailScreens = {
  // accounts
  AddAccount: AddAccountScreen,
  // settings
  SettingsNetwork: SettingsNetworkScreen,
  AddNetwork: AddNetworkScreen
};

// for tab icons
const iconMap = {
  Account: 'information-circle',
  Transaction: 'link',
  Network: 'desktop',
  Settings: 'options'
};

// tab navigator
const AppTabNavigator = createBottomTabNavigator(
  {
    Account: AccountScreen,
    Transaction: TransactionScreen,
    Network: NetworkScreen,
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
    MainTab: AppTabNavigator,
    ...DetailScreens
  },
  {
    headerMode: 'none'
  }
);
