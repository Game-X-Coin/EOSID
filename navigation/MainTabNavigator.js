import React from 'react';
import {
  createStackNavigator,
  createBottomTabNavigator
} from 'react-navigation';

import {
  AccountScreen,
  TransactionScreen,
  NetworkScreen,
  SettingScreen
} from '../screens';
import { NavigationTabBarIcon } from '../components/TabBarIcon';

const HomeStack = createStackNavigator({ Account: AccountScreen });
HomeStack.navigationOptions = {
  tabBarLabel: 'Account',
  tabBarIcon: ({ focused }) => (
    <NavigationTabBarIcon focused={focused} name="information-circle" />
  )
};

const TransactionStack = createStackNavigator({
  Transaction: TransactionScreen
});
TransactionStack.navigationOptions = {
  tabBarLabel: 'Transaction',
  tabBarIcon: ({ focused }) => (
    <NavigationTabBarIcon focused={focused} name="link" />
  )
};

const NetworkStack = createStackNavigator({ Network: NetworkScreen });
NetworkStack.navigationOptions = {
  tabBarLabel: 'Network',
  tabBarIcon: ({ focused }) => (
    <NavigationTabBarIcon focused={focused} name="desktop" />
  )
};

const SettingStack = createStackNavigator({ Setting: SettingScreen });
SettingStack.navigationOptions = {
  tabBarLabel: 'Setting',
  tabBarIcon: ({ focused }) => (
    <NavigationTabBarIcon focused={focused} name="options" />
  )
};

export default createBottomTabNavigator({
  HomeStack,
  TransactionStack,
  NetworkStack,
  SettingStack
});
