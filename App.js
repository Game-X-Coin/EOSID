import React, { Component } from 'react';
import { Provider } from 'mobx-react/native';
import { Provider as PaperProvider } from 'react-native-paper';

import RenderApp from './RenderApp';

import {
  PincodeStore,
  SettingsStore,
  NetworkStore,
  AccountStore
} from './stores';

export default class App extends Component {
  render() {
    const stores = {
      pincodeStore: PincodeStore,
      settingsStore: SettingsStore,
      networkStore: NetworkStore,
      accountStore: AccountStore
    };

    return (
      <Provider {...stores}>
        <PaperProvider>
          <RenderApp />
        </PaperProvider>
      </Provider>
    );
  }
}
