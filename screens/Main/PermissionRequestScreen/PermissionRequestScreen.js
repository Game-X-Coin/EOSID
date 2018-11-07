import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { SafeAreaView } from 'react-native';
import { Appbar } from 'react-native-paper';

import { PermissionRequestInfo } from './PermissionRequestInfo';
import { AccountEmptyState } from '../AccountScreen';

import HomeStyle from '../../../styles/HomeStyle';

@inject('accountStore')
@observer
export class PermissionRequestScreen extends Component {
  moveScreen = routeName => this.props.navigation.navigate(routeName);

  render() {
    const { currentAccount } = this.props.accountStore;

    return (
      <SafeAreaView style={HomeStyle.container}>
        <Appbar.Header>
          <Appbar.Content title="Permission Request" />
          <Appbar.Action
            icon="close"
            onPress={() => this.moveScreen('Account')}
          />
        </Appbar.Header>

        {currentAccount ? <PermissionRequestInfo /> : <AccountEmptyState />}
      </SafeAreaView>
    );
  }
}
