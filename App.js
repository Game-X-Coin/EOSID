import React, { Component } from 'react';
import { Provider } from 'mobx-react/native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Sentry from 'sentry-expo';

import RenderApp from './RenderApp';

import { Theme } from './constants/Theme';

import {
  PincodeStore,
  SettingsStore,
  NetworkStore,
  AccountStore
} from './stores';

// if you want to show error in development
// Sentry.enableInExpoDevelopment = true;

// initialize sentry
Sentry.config(
  'https://55321a0b2afa487c9b6ae9d5d1fa5ea9@sentry.io/1314438'
).install();

const theme = {
  ...DefaultTheme,
  ...Theme.paper,
  colors: {
    ...DefaultTheme.colors,
    ...Theme.paper.colors
  }
};

export default class App extends Component {
  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error, {
      extra: errorInfo
    });
  }

  render() {
    const stores = {
      pincodeStore: PincodeStore,
      settingsStore: SettingsStore,
      networkStore: NetworkStore,
      accountStore: AccountStore
    };

    return (
      <Provider {...stores}>
        <PaperProvider theme={theme}>
          <RenderApp />
        </PaperProvider>
      </Provider>
    );
  }
}
