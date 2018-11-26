import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';

import { Theme, DarkTheme } from '../../constants';

export class BackgroundView extends Component {
  render() {
    const { dark, style, children, ...props } = this.props;

    return (
      <React.Fragment>
        <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
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
      </React.Fragment>
    );
  }
}
