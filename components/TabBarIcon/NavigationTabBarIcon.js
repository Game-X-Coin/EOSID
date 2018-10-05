import React, { Component } from 'react';
import { Platform } from 'react-native';

import TabBarIcon from './TabBarIcon';

export default class NavigationTabBarIcon extends Component {
  render() {
    const { name, ...props } = this.props;
    return (
      <TabBarIcon
        name={
          Platform.OS === 'ios'
            ? `ios-${name}${this.props.focused ? '' : '-outline'}`
            : `md-${name}`
        }
        {...props}
      />
    );
  }
}
