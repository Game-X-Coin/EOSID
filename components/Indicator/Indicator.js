import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';

import { Theme } from '../../constants';

export class Indicator extends Component {
  render() {
    const { color = Theme.primary, size = 'large' } = this.props;

    return <ActivityIndicator color={color} size={size} />;
  }
}
