import React, { Component } from 'react';
import { View } from 'react-native';

import { Indicator } from './Indicator';

export class PageIndicator extends Component {
  render() {
    const { style, ...props } = this.props;

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          ...style
        }}
      >
        <Indicator {...props} />
      </View>
    );
  }
}
