import React, { Component } from 'react';
import { View, Linking } from 'react-native';
import { withNavigation } from 'react-navigation';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import {
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

import { Games } from '../../../constants/Apps';

import { AccountService } from '../../../services';

import { ScrollView } from '../../../components/View';

import {
  AuthorizeRequest,
  TransactionRequest,
  TransferRequest
} from './RequestTypes';
import { DialogIndicator } from '../../../components/Indicator';

@withNavigation
@inject('pincodeStore', 'accountStore')
@observer
export class PermissionRequestInfo extends Component {
  @observable
  accountDialogVisible = false;

  @observable
  loadAccount = false;

  constructor(params) {
    super(params);

    this.state = {
      params: {},
      app: {}
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const { params } = navigation.state;

    const app = this.getApp(parseFloat(params.appId)) || {};

    this.setState({ params, app });
  }

  showAccountDialog = () => (this.accountDialogVisible = true);
  hideAccountDialog = () => (this.accountDialogVisible = false);
  changeAccount = async account => {
    this.hideAccountDialog();

    this.loadAccount = true;
    await this.props.accountStore.changeCurrentAccount(account.id);
    this.loadAccount = false;
  };

  onConfirm = () => {
    const {
      navigation,
      pincodeStore,
      accountStore: { currentAccount }
    } = this.props;

    const { params, app } = this.state;

    navigation.navigate('ConfirmPin', {
      pinProps: {
        title: 'Confirm Access',
        description: `Confirm access from ${app.name}`
      },
      cb() {
        const signature = AccountService.sign({
          pincode: pincodeStore.accountPincode,
          encryptedPrivateKey: currentAccount.encryptedPrivateKey,
          data: params.q
        });

        const result = {
          signature,
          account: currentAccount.name,
          publicKey: currentAccount.publicKey
        };

        if (params.redirectURL) {
          Linking.openURL(params.redirectURL, result);
        }

        navigation.navigate('Account');
      }
    });
  };

  onCancel = () => {
    this.moveScreen('Account');
  };

  getApp = appId => Games.find(app => app.id === appId);

  moveScreen = routeName => this.props.navigation.navigate(routeName);

  render() {
    const { accountDialogVisible, loadAccount } = this;
    const { accounts, currentAccount } = this.props.accountStore;
    const { params, app } = this.state;

    const RenderRequest = () => {
      const requestTypes = {
        authorize: <AuthorizeRequest />,
        transfer: <TransferRequest transfer={params.transfer} />,
        transaction: <TransactionRequest transaction={params.transaction} />
      };

      return requestTypes[params.action];
    };

    const ChangeAccountDialog = () => (
      <Portal>
        <Dialog
          visible={accountDialogVisible}
          onDismiss={this.hideAccountDialog}
        >
          <Dialog.Title>Change Account</Dialog.Title>
          <Dialog.Content>
            {accounts.map(account => (
              <List.Item
                key={account.id}
                title={account.name}
                right={() => (
                  <RadioButton
                    status={
                      account.id === currentAccount.id ? 'checked' : 'unchecked'
                    }
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
      <View style={{ flex: 1 }}>
        {/* Load account dialog */}
        <DialogIndicator
          visible={loadAccount}
          title="Preparing to load account..."
        />

        {/* Change account dialog */}
        <ChangeAccountDialog />

        <ScrollView>
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
                {params.q}
              </Text>
              <Text style={{ fontSize: 20, marginBottom: 5 }}>{app.name}</Text>
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
                  {app.name}
                </Text>{' '}
                to
              </Caption>
              {params.action && <RenderRequest />}
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
                <Text>{currentAccount && currentAccount.name}</Text>
              </View>

              <Button mode="contained" compact onPress={this.showAccountDialog}>
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
            <Text style={{ fontWeight: 'bold', color: 'gray' }}>cannot</Text>{' '}
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
    );
  }
}
