import React, { Component } from 'react';
import { KeyboardAvoidingView as RNKeyboardAvoidingView } from 'react-native';

import { ScrollView } from './ScrollView';

export class KeyboardAvoidingView extends Component {
  render() {
    return (
      <RNKeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView {...this.props} />
      </RNKeyboardAvoidingView>
    );
  }
}
