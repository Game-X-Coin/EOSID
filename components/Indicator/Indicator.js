import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { Colors } from 'react-native-paper';

export class Indicator extends Component {
  render() {
    const { color = Colors.blue700, size = 'large' } = this.props;

    return <ActivityIndicator color={color} size={size} />;
  }
}
