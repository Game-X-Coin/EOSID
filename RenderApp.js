import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react/native';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Font, Icon } from 'expo';
import { EosProvider } from 'react-native-eosjs';

import AppNavigator from './navigation/AppNavigator';

import { initializeDB } from './db';

@inject('userStore', 'networkStore', 'accountStore')
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
    const { userStore, networkStore, accountStore } = this.props;

    await Promise.all([
      userStore.getUsers(),
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

        <EosProvider
          server="http://jungle.cryptolions.io:18888"
          chainId="038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca"
        />
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
