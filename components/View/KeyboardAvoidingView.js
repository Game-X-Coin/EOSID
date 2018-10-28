import React, { Component } from 'react';
import { KeyboardAvoidingView as RNKeyboardAvoidingView } from 'react-native';

export class KeyboardAvoidingView extends Component {
  render() {
    const { style, children } = this.props;
    return (
      <RNKeyboardAvoidingView behavior="padding" style={{ flex: 1, ...style }}>
        {children}
      </RNKeyboardAvoidingView>
    );
  }
}
