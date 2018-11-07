import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react/native';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Font, Icon } from 'expo';

import AppNavigator from './navigation/AppNavigator';

import { initializeDB } from './db';

@inject('pincodeStore', 'settingsStore', 'networkStore', 'accountStore')
@observer
export default class RenderApp extends Component {
  @observable
  isLoadingComplete = false;

  async startAsyncLoading() {
    return Promise.all([
      initializeDB(),
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

  async onFinishLoading() {
    const {
      pincodeStore,
      settingsStore,
      networkStore,
      accountStore
    } = this.props;

    await Promise.all([
      pincodeStore.getPincodes(),
      settingsStore.getSettings(),
      networkStore.getNetworks(),
      accountStore.getAccounts()
    ]);

    this.isLoadingComplete = true;
  }

  render() {
    if (!this.isLoadingComplete) {
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
