import React from 'react';
import {
  createStackNavigator,
  createBottomTabNavigator
} from 'react-navigation';

import { AccountScreen, SettingScreen } from '../screens';
import { NavigationTabBarIcon } from '../components/TabBarIcon';

const HomeStack = createStackNavigator({ Account: AccountScreen });
HomeStack.navigationOptions = {
  tabBarLabel: 'Account',
  tabBarIcon: ({ focused }) => (
    <NavigationTabBarIcon focused={focused} name="information-circle" />
  )
};

const SettingStack = createStackNavigator({ Setting: SettingScreen });
SettingStack.navigationOptions = {
  tabBarLabel: 'Setting',
  tabBarIcon: ({ focused }) => (
    <NavigationTabBarIcon focused={focused} name="options" />
  )
};

export default createBottomTabNavigator({ HomeStack, SettingStack });
