import React, { Component } from 'react';
import { View } from 'react-native';

import { Theme, DarkTheme } from '../../constants';

export class BackgroundView extends Component {
  render() {
    const { dark, style, children, ...props } = this.props;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: dark
            ? DarkTheme.app.backgroundColor
            : Theme.app.backgroundColor,
          ...style
        }}
        {...props}
      >
        {children}
      </View>
    );
  }
}
