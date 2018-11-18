import React, { Component } from 'react';
import { LinearGradient } from 'expo';

import { Theme } from '../../constants';

export class BackgroundView extends Component {
  render() {
    const { children } = this.props;

    const style = {
      flex: 1
    };

    return (
      <LinearGradient
        colors={Theme.mainBackgroundGradient}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={style}
      >
        {children}
      </LinearGradient>
    );
  }
}
