import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { View, Keyboard } from 'react-native';
import {
  Appbar,
  Button,
  Dialog,
  List,
  Portal,
  Text,
  Colors
} from 'react-native-paper';
import { TextField } from 'react-native-material-textfield';
import { Dropdown } from 'react-native-material-dropdown';
import { Icon } from 'expo';
import { withFormik } from 'formik';
import * as Yup from 'yup';

import { AccountError } from '../../../db';
import { AccountService } from '../../../services';

import api from '../../../utils/eos/API';

import { ScrollView, KeyboardAvoidingView } from '../../../components/View';

import HomeStyle from '../../../styles/HomeStyle';
import { DialogIndicator } from '../../../components/Indicator';

@inject('settingsStore', 'networkStore', 'accountStore')
@withFormik({
  mapPropsToValues: ({ networkStore }) => ({
    accounts: [],
    // form
    privateKey: '',
    publicKey: '',
    networkId: networkStore.defaultNetworks[0].id // default network
  }),
  validationSchema: props => {
    const { errors: RequiredFieldErrors } = AccountError.RequiredFields;
    const { errors: InvalidPrivateKeyErrors } = AccountError.InvalidPrivateKey;

    return Yup.object().shape({
      privateKey: Yup.string()
        .required(RequiredFieldErrors.privateKey)
        .test('validate-privateKey', InvalidPrivateKeyErrors.privateKey, v =>
          api.Key.isValidPrivate({ wif: v })
        ),
      networkId: Yup.string().required(RequiredFieldErrors.networkId)
    });
  }
})
@observer
export class ImportAccountScreen extends Component {
  @observable
  showDialog = false;

  @observable
  showLoadingDialog = false;

  async handleSubmit() {
    const {
      networkStore: { allNetworks },
      values,
      setFieldValue,
      setErrors
    } = this.props;
    // avoid modal hiding
    Keyboard.dismiss();

    // private to public
    const publicKey = api.Key.privateToPublic({ wif: values.privateKey });
    setFieldValue('publicKey', publicKey);

    // show loading dialog
    this.toggleLoadingDialog();

    try {
      const network = allNetworks.find(({ id }) => id === values.networkId);
      const accounts = await AccountService.findKeyAccount(
        publicKey,
        network.historyURL
      );

      // key has single account
      if (accounts.length === 1) {
        this.importAccount(accounts[0]);
      } else {
        setFieldValue('accounts', accounts);
        this.toggleDialog();
        this.toggleLoadingDialog();
      }
    } catch (error) {
      setErrors({ message: error.message, ...error.errors });
      this.toggleLoadingDialog();
    }
  }

  async importAccount(accountName) {
    const {
      accountStore,
      settingsStore: { settings },
      networkStore: { allNetworks },
      navigation,
      values,
      setErrors
    } = this.props;
    const { isSignUp } = navigation.state.params || {};

    const network = allNetworks.find(({ id }) => id === values.networkId);

    const addAccount = async () => {
      // show loading
      this.toggleLoadingDialog();

      const { permissions } = await api.accounts.get({
        account_name: accountName,
        url: network.chainURL
      });

      // find included permissions by publicKey
      const foundPerms = permissions
        .filter(p =>
          p.required_auth.keys.find(key => key.key === values.publicKey)
        )
        .map(p => p.perm_name);

      // add account
      try {
        await accountStore.addAccount({
          name: accountName,
          publicKey: values.publicKey,
          privateKey: values.privateKey,
          networkId: values.networkId,
          permissions: foundPerms
        });
      } catch (error) {
        setErrors({ importError: true, ...error.errors });
        this.hideDialogs();
        return;
      }

      // hide loading
      this.toggleLoadingDialog();

      // navigate
      isSignUp ? navigation.navigate('Account') : navigation.goBack(null);
    };

    // hide dialogs before navigate
    this.hideDialogs();

    // new account pincode
    if (!settings.accountPincodeEnabled) {
      navigation.navigate('NewPin', {
        async cb() {
          await addAccount();
        }
      });
    } else {
      await addAccount();
    }
  }

  toggleDialog() {
    this.showDialog = !this.showDialog;
  }

  toggleLoadingDialog() {
    this.showLoadingDialog = !this.showLoadingDialog;
  }

  hideDialogs() {
    this.showDialog = false;
    this.showLoadingDialog = false;
  }

  render() {
    const {
      navigation,
      networkStore: { allNetworks },

      values,
      errors,
      touched,
      setFieldValue,
      setFieldTouched,
      isValid
    } = this.props;

    const isSignUp =
      navigation.state.params && navigation.state.params.isSignUp;

    const networks = allNetworks.map(network => ({
      label: network.name,
      value: network.id
    }));

    const SelectAccountDialog = () => (
      <Portal>
        <Dialog visible={this.showDialog} onDismiss={() => this.hideDialogs()}>
          <Dialog.Title>Select account</Dialog.Title>
          <Dialog.Content>
            {values.accounts.map(account => (
              <List.Item
                key={account}
                title={account}
                onPress={() => this.importAccount(account)}
              />
            ))}
          </Dialog.Content>
        </Dialog>
      </Portal>
    );

    return (
      <View style={HomeStyle.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack(null)} />
          <Appbar.Content title="Import account" />
        </Appbar.Header>

        {/* Dialog */}
        <SelectAccountDialog />

        {/* Import loading */}
        <DialogIndicator
          visible={this.showLoadingDialog}
          title="Preparing to import account..."
        />

        <KeyboardAvoidingView>
          <ScrollView style={{ paddingHorizontal: 20, paddingBottom: 60 }}>
            <TextField
              autoFocus
              multiline
              label="Private key"
              title="Enter the private key of the account to import"
              style={{ fontFamily: 'monospace' }}
              value={values.privateKey}
              error={touched.privateKey && errors.privateKey}
              onChangeText={_ => {
                setFieldTouched('privateKey', true);
                setFieldValue('privateKey', _);
              }}
            />

            <Dropdown
              label="Network"
              title="Network of account to import"
              data={networks}
              value={values.networkId}
              error={touched.networkId && errors.networkId}
              onChangeText={_ => {
                setFieldTouched('networkId', true);
                setFieldValue('networkId', _);
              }}
            />

            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <Icon.Ionicons
                name="md-lock"
                size={30}
                color={Colors.grey900}
                style={{ marginRight: 15 }}
              />
              <Text style={{ flex: 1, color: Colors.grey900 }}>
                EOSID encrypts the private key and stores it securely on the
                device.
              </Text>
            </View>
          </ScrollView>

          {/* Fixed bottom buttons */}
          <View style={{ flexDirection: 'row' }}>
            {isSignUp && (
              <Button
                style={{ flex: 1, padding: 5, borderRadius: 0 }}
                onPress={() => navigation.navigate('Account')}
              >
                Skip
              </Button>
            )}
            <Button
              mode="contained"
              style={{ flex: 2, padding: 5, borderRadius: 0 }}
              // keep enable button when import failed
              disabled={!isValid && !errors.importError}
              onPress={() => this.handleSubmit()}
            >
              Import
            </Button>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}
