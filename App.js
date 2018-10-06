import React, { Component } from 'react';
import { Provider } from 'mobx-react';

import RenderApp from './RenderApp';

export default class App extends Component {
  render() {
    return (
      <Provider>
        <RenderApp />
      </Provider>
    );
  }
}
