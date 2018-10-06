import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Font, Icon } from 'expo';

import AppNavigator from './navigation/AppNavigator';

export default class RenderApp extends Component {
  constructor() {
    super();

    this.state = {
      isLoadingComplete: false
    };
  }

  async startAsyncLoading() {
    return Promise.all([
      // Asset.loadAsync(),
      Font.loadAsync({
        ...Icon.Ionicons.font
      })
    ]);
  }

  onErrorLoading(error) {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  }

  onFinishLoading() {
    this.setState({ isLoadingComplete: true });
  }

  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={() => this.startAsyncLoading()}
          onError={() => this.onErrorLoading()}
          onFinish={() => this.onFinishLoading()}
        />
      );
    }

    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
