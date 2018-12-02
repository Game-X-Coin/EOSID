import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Appbar } from 'react-native-paper';

import { AccountEmptyState } from '../AccountScreen';
import { ActivityInfo } from './ActivityInfo';

import { Theme } from '../../../constants';
import { BackgroundView } from '../../../components/View';

@inject('accountStore')
@observer
export class ActivityScreen extends Component {
  render() {
    const { currentAccount } = this.props.accountStore;

    return (
      <BackgroundView>
        <Appbar.Header
          style={{ backgroundColor: Theme.header.backgroundColor }}
        >
          <Appbar.Content title="Recent Activities" />
        </Appbar.Header>

        {currentAccount ? (
          <ActivityInfo />
        ) : (
          // account empty
          <AccountEmptyState />
        )}
      </BackgroundView>
    );
  }
}
