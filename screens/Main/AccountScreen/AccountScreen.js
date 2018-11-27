import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Appbar } from 'react-native-paper';

import { AccountInfo } from './AccountInfo';
import { AccountEmptyState } from './AccountEmptyState';

import { Theme } from '../../../constants';
import { BackgroundView } from '../../../components/View';

@inject('accountStore')
@observer
export class AccountScreen extends Component {
  moveScreen = (...args) => this.props.navigation.navigate(...args);

  render() {
    const { currentAccount } = this.props.accountStore;

    return (
      <BackgroundView>
        {!currentAccount && (
          <Appbar.Header
            style={{ backgroundColor: Theme.header.backgroundColor }}
          >
            <Appbar.Content title="Account" />
          </Appbar.Header>
        )}

        {currentAccount ? <AccountInfo /> : <AccountEmptyState />}
      </BackgroundView>
    );
  }
}
