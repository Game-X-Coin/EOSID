import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Appbar } from 'react-native-paper';

import { AccountEmptyState } from '../AccountScreen';
import { TransactionInfo } from './TransactionInfo';

import { Theme } from '../../../constants';
import { BackgroundView } from '../../../components/View';

@inject('accountStore')
@observer
export class TransactionScreen extends Component {
  render() {
    const { currentAccount } = this.props.accountStore;

    return (
      <BackgroundView>
        <Appbar.Header style={{ backgroundColor: Theme.headerBackgroundColor }}>
          <Appbar.Content title="Transaction" />
        </Appbar.Header>

        {currentAccount ? (
          <TransactionInfo />
        ) : (
          // account empty
          <AccountEmptyState />
        )}
      </BackgroundView>
    );
  }
}
