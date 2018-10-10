import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import {
  Appbar,
  Button,
  Dialog,
  List,
  Portal,
  RadioButton
} from 'react-native-paper';
import { TextField } from 'react-native-material-textfield';
import { Dropdown } from 'react-native-material-dropdown';
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
    selectedAccount: '',
    // form
    privateKey: '',
    publicKey: '',
    networkId: props.networkStore.defaultNetworks[0].id
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
    { props, setSubmitting, setValues, setErrors }
  ) => {
    try {
      const publicKey = await AccountService.privateToPublic(values.privateKey);
      const accounts = await AccountService.findKeyAccount(publicKey);

      setValues({
        ...values,
        showDialog: true,
        accounts,
        publicKey
      });
    } catch (error) {
      setErrors({ message: error.message, ...error.errors });
      setSubmitting(false);
    }
  }
})
@observer
export class AddAccountScreen extends Component {
  async addAccount() {
    const { accountStore, navigation, values } = this.props;

    if (!values.selectedAccount) {
      return;
    }

    await accountStore.addAccount({
      name: values.selectedAccount,
      privateKey: values.privateKey,
      publicKey: values.publicKey,
      networkId: values.networkId
    });

    navigation.navigate('Account');
  }

  selectAccount(account) {
    this.props.setFieldValue('selectedAccount', account);
  }

  cancelSelectAccount() {
    this.props.setFieldValue('showDialog', false)
    this.props.setSubmitting(false)
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

    const networks = [...defaultNetworks, ...userNetworks].map(network => ({
      label: network.name,
      value: network.id
    }));

    const EosAccountDialog = () => (
      <Portal>
        <Dialog
          visible={values.showDialog}
          onDismiss={() => this.cancelSelectAccount()}
        >
          <Dialog.Title>Select eos account</Dialog.Title>
          <Dialog.Content>
            <List.Section>
              {values.accounts.map(account => (
                <List.Item
                  key={account}
                  title={account}
                  right={() => (
                    <RadioButton
                      status={
                        values.selectedAccount === account
                          ? 'checked'
                          : 'unchecked'
                      }
                      onPress={() => this.selectAccount(account)}
                    />
                  )}
                  onPress={() => this.selectAccount(account)}
                />
              ))}
            </List.Section>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => this.addAccount()}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );

    return (
      <View style={HomeStyle.container}>
        <SafeAreaView style={HomeStyle.container}>
          <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.goBack(null)} />
            <Appbar.Content title={'Add eos account'} />
          </Appbar.Header>
          <ScrollView style={HomeStyle.container}>
            <View style={{ paddingHorizontal: 15 }}>
              <TextField
                multiline
                label="Private key"
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
                data={networks}
                value={values.networkId}
                error={touched.networkId && errors.networkId}
                onChangeText={_ => {
                  setFieldTouched('networkId', true);
                  setFieldValue('networkId', _);
                }}
              />

              <Button
                mode="contained"
                style={{ padding: 5, marginTop: 15 }}
                loading={isSubmitting}
                onPress={() => handleSubmit()}
              >
                Add eos account
              </Button>
            </View>

            <EosAccountDialog />
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
