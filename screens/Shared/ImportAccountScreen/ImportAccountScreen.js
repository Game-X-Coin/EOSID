import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import {
  SafeAreaView,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import {
  Appbar,
  Button,
  Dialog,
  List,
  Portal,
  Divider,
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

import HomeStyle from '../../../styles/HomeStyle';

@inject('networkStore', 'accountStore')
@withFormik({
  mapPropsToValues: props => ({
    // select account
    showDialog: false,
    accounts: [],
    // form
    privateKey: '',
    publicKey: '',
    networkId: props.networkStore.defaultNetworks[0].id // default network
  }),
  validationSchema: props => {
    const { errors } = AccountError.RequiredFields;

    return Yup.object().shape({
      privateKey: Yup.string().required(errors.privateKey),
      networkId: Yup.string().required(errors.networkId)
    });
  },
  handleSubmit: async (
    values,
    {
      props: { networkStore, accountStore, navigation },
      setSubmitting,
      setValues,
      setErrors
    }
  ) => {
    try {
      const publicKey = await AccountService.privateToPublic(values.privateKey);
      const accounts = await AccountService.findKeyAccount(
        publicKey,
        networkStore.eos
      );

      // key has single account
      if (accounts.length === 1) {
        await accountStore.addAccount({
          name: accounts[0],
          privateKey: values.privateKey,
          networkId: values.networkId,
          publicKey
        });

        navigation.navigate('Account');
      } else {
        // avoid modal hiding
        Keyboard.dismiss();

        setValues({
          ...values,
          showDialog: true,
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
    const { accountStore, values } = this.props;

    await accountStore.addAccount({
      ...values,
      name
    });

    this.moveToAccountScreen();
  }

  cancelSelectAccount() {
    this.props.setFieldValue('showDialog', false);
    this.props.setSubmitting(false);
  }

  moveToAccountScreen() {
    this.props.navigation.navigate('Account');
  }

  render() {
    const {
      navigation,
      networkStore: { defaultNetworks, userNetworks },

      values,
      errors,
      touched,
      setFieldValue,
      setFieldTouched,
      handleSubmit,
      isSubmitting
    } = this.props;

    const isSignUp =
      navigation.state.params && navigation.state.params.isSignUp;

    const networks = [...defaultNetworks, ...userNetworks].map(network => ({
      label: network.name,
      value: network.id
    }));

    const SelectAccountDialog = () => (
      <Portal>
        <Dialog
          visible={values.showDialog}
          onDismiss={() => this.cancelSelectAccount()}
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

        <KeyboardAvoidingView behavior="padding" style={HomeStyle.container}>
          <ScrollView
            keyboardShouldPersistTaps="always"
            style={HomeStyle.container}
          >
            <View style={{ flex: 1, paddingHorizontal: 20, paddingBottom: 60 }}>
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

              <Divider style={{ marginVertical: 15 }} />

              <View style={{ flexDirection: 'row' }}>
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
            </View>
          </ScrollView>

          {/* Fixed bottom buttons */}
          <View style={{ flexDirection: 'row' }}>
            {isSignUp && (
              <Button
                style={{ flex: 1, padding: 5, borderRadius: 0 }}
                onPress={() => this.moveToAccountScreen()}
              >
                Skip
              </Button>
            )}
            <Button
              mode="contained"
              style={{ flex: 2, padding: 5, borderRadius: 0 }}
              loading={isSubmitting}
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
