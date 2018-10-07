import React, { Component } from 'react';
import { Provider } from 'mobx-react';

import RenderApp from './RenderApp';

import { UserStore } from './stores';

export default class App extends Component {
  render() {
    const stores = {
      userStore: UserStore
    };

    return (
      <Provider {...stores}>
        <RenderApp />
      </Provider>
    );
  }
}
