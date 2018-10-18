import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { SafeAreaView, View, ScrollView } from 'react-native';
import {
  Appbar,
  Button,
  Text,
  Divider,
  Colors,
  Caption,
  Dialog,
  List,
  Portal,
  RadioButton
} from 'react-native-paper';
import { Icon } from 'expo';

import {
  AuthorizeRequest,
  TransactionRequest,
  TransferRequest
} from './RequestTypes';

import HomeStyle from '../../../styles/HomeStyle';

@inject('accountStore')
@observer
export class PermissionRequestScreen extends Component {
  @observable
  changeAccountDialog = false;

  @observable
  selectedAccount = this.props.accountStore.currentUserAccount;

  showChangeAccountDialog = () => (this.changeAccountDialog = true);
  hideChangeAccountDialog = () => (this.changeAccountDialog = false);
  changeAccount = account => {
    this.selectedAccount = account;
    this.hideChangeAccountDialog();
  };

  moveScreen = routeName => this.props.navigation.navigate(routeName);

  onConfirm = () => {};

  onCancel = () => {};

  render() {
    const { changeAccountDialog, selectedAccount } = this;
    const { userAccounts } = this.props.accountStore;
    let {
      params = { code: '3FVASC', appName: 'Zombie Rizing', type: 'authorize' }
    } = this.props.navigation.state;

    const RenderRequest = () => {
      const requestTypes = {
        authorize: <AuthorizeRequest />,
        transfer: <TransferRequest transfer={params.transfer} />,
        transaction: <TransactionRequest transaction={params.transaction} />
      };

      return requestTypes[params.type];
    };

    const ChangeAccountDialog = () => (
      <Portal>
        <Dialog
          visible={changeAccountDialog}
          onDismiss={this.hideChangeAccountDialog}
        >
          <Dialog.Title>Change Account</Dialog.Title>
          <Dialog.Content>
            {userAccounts.map(account => (
              <List.Item
                key={account.id}
                title={account.name}
                right={() => (
                  <RadioButton
                    status={
                      account.id === selectedAccount.id
                        ? 'checked'
                        : 'unchecked'
                    }
                    onPress={() => this.changeAccount(account)}
                  />
                )}
                onPress={() => this.changeAccount(account)}
              />
            ))}
          </Dialog.Content>
        </Dialog>
      </Portal>
    );

    return (
      <View style={HomeStyle.container}>
        <SafeAreaView style={HomeStyle.container}>
          <Appbar.Header>
            <Appbar.Content title="Permission Request" />
            <Appbar.Action
              icon="close"
              onPress={() => this.moveScreen('Account')}
            />
          </Appbar.Header>

          <View style={{ flex: 1 }}>
            <ScrollView
              style={{
                flex: 1
              }}
            >
              <View style={{ flex: 1, padding: 25 }}>
                <View style={{ paddingVertical: 15, alignItems: 'center' }}>
                  <Text
                    style={{
                      fontSize: 35,
                      paddingTop: 25,
                      paddingBottom: 35,
                      color: Colors.green500
                    }}
                  >
                    {params.code}
                  </Text>
                  <Text style={{ fontSize: 20, marginBottom: 5 }}>
                    {params.appName}
                  </Text>
                  <Caption>
                    Make sure it matches the code shown in the application.
                  </Caption>
                </View>

                <Divider />

                {/* Confirm View */}
                <View style={{ paddingVertical: 18 }}>
                  <Caption>
                    Confirm the request, this will allow{' '}
                    <Text style={{ fontWeight: 'bold', color: 'gray' }}>
                      {params.appName}
                    </Text>{' '}
                    to
                  </Caption>
                  <RenderRequest />
                </View>

                <Divider />

                {/* Account, Change Account View */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 18
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Caption>Access Account</Caption>
                    <Text>{selectedAccount.name}</Text>
                  </View>

                  <Button
                    mode="contained"
                    compact
                    onPress={this.showChangeAccountDialog}
                  >
                    Change
                  </Button>
                </View>
              </View>
            </ScrollView>

            {/* Fixed bottom */}
            <View>
              <Caption
                style={{
                  alignSelf: 'stretch',
                  paddingVertical: 5,
                  backgroundColor: '#fafafa',
                  textAlign: 'center'
                }}
              >
                <Icon.Ionicons name="md-lock" size={15} /> This application{' '}
                <Text style={{ fontWeight: 'bold', color: 'gray' }}>
                  cannot
                </Text>{' '}
                access your private key
              </Caption>

              {/* Submit, Cancel View */}
              <View style={{ flexDirection: 'row', padding: 20 }}>
                <Button
                  style={{ padding: 5, marginRight: 10 }}
                  onPress={() => this.onCancel()}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  style={{ flex: 1, padding: 5 }}
                  onPress={() => this.onConfirm()}
                >
                  Confirm
                </Button>
              </View>
            </View>
          </View>

          <ChangeAccountDialog />
        </SafeAreaView>
      </View>
    );
  }
}
