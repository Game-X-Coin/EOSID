import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { SafeAreaView, View, Keyboard } from 'react-native';
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
    // select account
    showDialog: false,
    // loading
    showLoadingDialog: false,
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
  },
  handleSubmit: async (
    values,
    {
      props: {
        settingsStore,
        networkStore: { allNetworks },
        accountStore,
        navigation
      },
      setSubmitting,
      setValues,
      setFieldValue,
      setErrors
    }
  ) => {
    const { isSignUp } = navigation.state.params || {};

    // avoid modal hiding
    Keyboard.dismiss();

    const publicKey = api.Key.privateToPublic({ wif: values.privateKey });

    // show loading dialog
    setFieldValue('showLoadingDialog', true);

    try {
      const network = allNetworks.find(({ id }) => id === values.networkId);
      const accounts = await AccountService.findKeyAccount(
        publicKey,
        network.historyURL
      );

      // key has single account
      if (accounts.length === 1) {
        const accountName = accounts[0];
        const accountInfo = await api.accounts.get({
          account_name: accountName,
          url: network.chainURL
        });
        const permissions = accountInfo.permissions;
        const permission = permissions.find(permission =>
          permission.required_auth.keys.find(key => key.key === publicKey)
        );

        setValues({
          ...values,
          showLoadingDialog: false
        });

        const addAccount = async () => {
          await accountStore.addAccount({
            name: accountName,
            privateKey: values.privateKey,
            networkId: values.networkId,
            publicKey,
            permission: permission.perm_name
          });

          isSignUp ? navigation.navigate('Account') : navigation.goBack(null);
        };

        // new account pincode
        if (!settingsStore.settings.accountPincodeEnabled) {
          navigation.navigate('NewPin', {
            async cb() {
              await addAccount();
            }
          });
        } else {
          await addAccount();
        }
      } else {
        setValues({
          ...values,
          showDialog: true,
          showLoadingDialog: false,
          accounts,
          publicKey
        });
      }
    } catch (error) {
      setErrors({ message: error.message, ...error.errors });
      setSubmitting(false);
    }
  }
})
@observer
export class ImportAccountScreen extends Component {
  async importAccount(name) {
    const {
      networkStore: { allNetworks },
      settingsStore,
      accountStore,
      navigation,
      values
    } = this.props;

    this.hideDialogs();

    const publicKey = api.Key.privateToPublic({ wif: values.privateKey });
    const network = allNetworks.find(({ id }) => id === values.networkId);

    const accountInfo = await api.accounts.get({
      account_name: name,
      url: network.chainURL
    });
    const permissions = accountInfo.permissions;
    const permission = permissions.find(permission =>
      permission.required_auth.keys.find(key => key.key === publicKey)
    );

    const addAccount = async () => {
      await accountStore.addAccount({
        ...values,
        name,
        publicKey,
        permission: permission.perm_name
      });

      this.moveScreen();
    };

    // new account pincode
    if (!settingsStore.settings.accountPincodeEnabled) {
      navigation.navigate('NewPin', {
        cb: async () => {
          await addAccount();
        }
      });
    } else {
      await addAccount();
    }
  }

  hideDialogs() {
    this.props.setFieldValue('showLoadingDialog', false);
    this.props.setFieldValue('showDialog', false);
  }

  moveScreen() {
    const { navigation } = this.props;
    const { isSignUp } = navigation.state.params || {};

    isSignUp ? navigation.navigate('Account') : navigation.goBack(null);
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
      handleSubmit
    } = this.props;

    const isSignUp =
      navigation.state.params && navigation.state.params.isSignUp;

    const networks = allNetworks.map(network => ({
      label: network.name,
      value: network.id
    }));

    const SelectAccountDialog = () => (
      <Portal>
        <Dialog
          visible={values.showDialog}
          onDismiss={() => this.hideDialogs()}
        >
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
      <SafeAreaView style={HomeStyle.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack(null)} />
          <Appbar.Content title="Import account" />
        </Appbar.Header>

        {/* Dialog */}
        <SelectAccountDialog />

        {/* Import loading */}
        <DialogIndicator
          visible={values.showLoadingDialog}
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
              onPress={handleSubmit}
            >
              Import
            </Button>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}
