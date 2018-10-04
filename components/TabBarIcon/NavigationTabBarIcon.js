import React, { Component } from 'react';
import { Platform } from 'react-native';

import TabBarIcon from './TabBarIcon';

export default class NavigationTabBarIcon extends Component {
  render() {
    return (
      <TabBarIcon
        name={
          Platform.OS === 'ios'
            ? `ios-information-circle${this.props.focused ? '' : '-outline'}`
            : 'md-information-circle'
        }
        {...this.props}
      />
    );
  }
}
