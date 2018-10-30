import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { SafeAreaView } from 'react-native';
import { Appbar } from 'react-native-paper';

import { AccountInfo } from './AccountInfo';
import { AccountEmptyState } from './AccountEmptyState';

import HomeStyle from '../../../styles/HomeStyle';

@inject('accountStore')
@observer
export class AccountScreen extends Component {
  moveScreen = (...args) => this.props.navigation.navigate(...args);

  render() {
    const { currentUserAccount } = this.props.accountStore;

    return (
      <SafeAreaView style={HomeStyle.container}>
        {!currentUserAccount && (
          <Appbar.Header>
            <Appbar.Content title="Account" />
            <Appbar.Action
              icon="add"
              onPress={() => this.moveScreen('ImportAccount')}
            />
          </Appbar.Header>
        )}

        {currentUserAccount ? <AccountInfo /> : <AccountEmptyState />}
      </SafeAreaView>
    );
  }
}
