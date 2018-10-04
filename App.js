import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';

import AppNavigator from './navigation/AppNavigator';

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      isLoadingComplete: false
    };
  }

  render() {
    return (
      <React.Fragment>
        {!this.state.isLoadingComplete && !this.props.skipLoadingScreen ? (
          <AppLoading
            startAsync={() => this.startAsyncLoading}
            onError={() => this.onErrorLoading()}
            onFinish={() => this.onFinishLoading()}
          />
        ) : (
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <AppNavigator />
          </View>
        )}
      </React.Fragment>
    );
  }

  async startAsyncLoading() {
    return Promise.all([
      Asset.loadAsync(),
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
    // alignItems: 'center',
    // justifyContent: 'center'
  }
});
