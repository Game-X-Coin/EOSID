import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { View, Keyboard, SafeAreaView } from 'react-native';
import {
  Appbar,
  Button,
  Dialog,
  List,
  Portal,
  Text,
  Colors
} from 'react-native-paper';
import { Icon } from 'expo';
import { withFormik } from 'formik';
import * as Yup from 'yup';

import { AccountError } from '../../../db';
import { AccountService } from '../../../services';

import api from '../../../utils/eos/API';

import {
  ScrollView,
  KeyboardAvoidingView,
  BackgroundView
} from '../../../components/View';

import { DialogIndicator } from '../../../components/Indicator';
import { Theme } from '../../../constants';
import { TextField } from '../../../components/TextField';
import { SelectField } from '../../../components/SelectField';

import Chains from '../../../constants/Chains';

@inject('settingsStore', 'networkStore', 'accountStore', 'pincodeStore')
@withFormik({
  mapPropsToValues: ({ networkStore }) => ({
    accounts: [],
    // form
    privateKey: '',
    publicKey: '',
    chainId: Chains[0].id // default network
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
      chainId: Yup.string().required(RequiredFieldErrors.chainId)
    });
  }
})
@observer
export class ImportAccountScreen extends Component {
  state = {
    showDialog: false,
    showLoadingDialog: false
  };

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
      const network = allNetworks.find(
        ({ chainId }) => chainId === values.chainId
      );
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
      pincodeStore: { accountPincode },
      navigation,
      values,
      setErrors
    } = this.props;

    const network = allNetworks.find(
      ({ chainId }) => chainId === values.chainId
    );

    const addAccount = async pincode => {
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
          chainId: values.chainId,
          permissions: foundPerms,
          pincode: pincode && accountPincode
        });
      } catch (error) {
        console.log(error);
        setErrors({ importError: true, ...error.errors });
        this.hideDialogs();
        return;
      }

      // hide loading
      this.toggleLoadingDialog();

      navigation.navigate('Account');
    };

    // hide dialogs before navigate
    this.hideDialogs();

    // new account pincode
    if (!settings.accountPincodeEnabled) {
      navigation.navigate('NewPin', {
        async cb(pincode) {
          await addAccount(pincode);
        }
      });
    } else {
      await addAccount(accountPincode);
    }
  }

  toggleDialog() {
    this.setState({
      showDialog: !this.state.showDialog
    });
  }

  toggleLoadingDialog() {
    this.setState({
      showLoadingDialog: !this.state.showLoadingDialog
    });
  }

  hideDialogs() {
    this.setState({
      showDialog: false,
      showLoadingDialog: false
    });
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
    console.log(errors);
    const { showDialog, showLoadingDialog } = this.state;

    const isSignUp =
      navigation.state.params && navigation.state.params.isSignUp;

    const chains = Chains.map(chain => ({
      label: chain.name,
      value: chain.id
    }));

    const SelectAccountDialog = () => (
      <Portal>
        <Dialog visible={showDialog} onDismiss={() => this.hideDialogs()}>
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
      <BackgroundView>
        <Appbar.Header
          style={{ backgroundColor: Theme.header.backgroundColor }}
        >
          {!isSignUp && (
            <Appbar.BackAction onPress={() => navigation.goBack(null)} />
          )}
          <Appbar.Content title="Import account" />
        </Appbar.Header>

        {/* Dialog */}
        <SelectAccountDialog />

        {/* Import loading */}
        <DialogIndicator
          visible={showLoadingDialog}
          title="Preparing to import account..."
        />

        <KeyboardAvoidingView>
          <ScrollView style={{ paddingHorizontal: 20, paddingBottom: 60 }}>
            <TextField
              autoFocus
              multiline
              label="Private key"
              info="Private key of account to import"
              value={values.privateKey}
              error={touched.privateKey && errors.privateKey}
              onChangeText={_ => {
                setFieldTouched('privateKey', true);
                setFieldValue('privateKey', _);
              }}
            />

            <SelectField
              label="Chain"
              info="Chain of account to import"
              data={chains}
              value={values.chainId}
              error={touched.chainId && errors.chainId}
              onChangeText={_ => {
                setFieldTouched('chainId', true);
                setFieldValue('chainId', _);
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
          <SafeAreaView style={{ flexDirection: 'row' }}>
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
          </SafeAreaView>
        </KeyboardAvoidingView>
      </BackgroundView>
    );
  }
}
