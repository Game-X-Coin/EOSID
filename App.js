import React, { Component } from 'react';
import { Provider } from 'mobx-react/native';

import RenderApp from './RenderApp';

import { UserStore, NetworkStore } from './stores';

export default class App extends Component {
  render() {
    const stores = {
      userStore: UserStore,
      networkStore: NetworkStore
    };

    return (
      <Provider {...stores}>
        <RenderApp />
      </Provider>
    );
  }
}
