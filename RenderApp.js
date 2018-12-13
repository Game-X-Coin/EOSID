import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react/native';
import { StyleSheet, View } from 'react-native';
import { AppLoading, Font, Icon } from 'expo';

import AppNavigator from './navigation/AppNavigator';
import { MainStackNavigator } from './navigation/navigators';

import { initializeDB } from './db';

@inject('pincodeStore', 'settingsStore', 'networkStore', 'accountStore')
@observer
export default class RenderApp extends Component {
  @observable
  isLoadingComplete = false;

  @observable
  initialized = false;

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

    networkStore.setCurrentNetwork(accountStore.currentAccount);

    // already initialized
    if (settingsStore.initialized) {
      this.initialized = true;
    }

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
        {this.initialized ? <MainStackNavigator /> : <AppNavigator />}
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
