import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { SafeAreaView, View } from 'react-native';
import { Appbar, Title, TouchableRipple } from 'react-native-paper';
import { Icon } from 'expo';

import { AccountInfo } from './AccountInfo';
import { AccountSelectDrawer } from './AccountSelectDrawer';
import { AccountEmptyState } from './AccountEmptyState';

import HomeStyle from '../../../styles/HomeStyle';

@inject('accountStore')
@observer
export class AccountScreen extends Component {
  @observable
  drawerVisible = false;

  showDrawer() {
    this.drawerVisible = true;
  }

  hideDrawer() {
    this.drawerVisible = false;
  }

  moveScreen = (...args) => this.props.navigation.navigate(...args);

  render() {
    const { currentUserAccount } = this.props.accountStore;

    return (
      <SafeAreaView style={HomeStyle.container}>
        <Appbar.Header>
          <View
            style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 15 }}
          >
            <TouchableRipple borderless onPress={() => this.showDrawer()}>
              <Title
                style={{
                  color: '#fff',
                  fontSize: 20
                }}
              >
                {currentUserAccount ? currentUserAccount.name : 'Account'}{' '}
                <Icon.Ionicons name="md-arrow-dropdown" size={18} />
              </Title>
            </TouchableRipple>
            <View style={{ flex: 1 }} />
          </View>
          <Appbar.Action
            icon="add"
            onPress={() => this.moveScreen('ImportAccount')}
          />
        </Appbar.Header>

        {/* Drawer */}
        <AccountSelectDrawer
          visible={this.drawerVisible}
          onHide={() => this.hideDrawer()}
        />

        {currentUserAccount ? <AccountInfo /> : <AccountEmptyState />}
      </SafeAreaView>
    );
  }
}
