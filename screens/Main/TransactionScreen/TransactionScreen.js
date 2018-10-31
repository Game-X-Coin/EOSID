import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { SafeAreaView } from 'react-native';
import { Appbar } from 'react-native-paper';

import { AccountEmptyState } from '../AccountScreen';
import { TransactionInfo } from './TransactionInfo';

import HomeStyle from '../../../styles/HomeStyle';

@inject('accountStore')
@observer
export class TransactionScreen extends Component {
  render() {
    const { currentAccount } = this.props.accountStore;

    return (
      <SafeAreaView style={HomeStyle.container}>
        <Appbar.Header>
          <Appbar.Content title="Transaction" />
        </Appbar.Header>

        {currentAccount ? (
          <TransactionInfo />
        ) : (
          // account empty
          <AccountEmptyState />
        )}
      </SafeAreaView>
    );
  }
}
