import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import {
  SafeAreaView,
  ScrollView,
  View,
  KeyboardAvoidingView
} from 'react-native';
import { Appbar, Button, Portal, Dialog, Paragraph } from 'react-native-paper';
import { TextField } from 'react-native-material-textfield';
import { withFormik } from 'formik';
import * as Yup from 'yup';

import HomeStyle from '../../../styles/HomeStyle';

@inject('accountStore')
@observer
@withFormik({
  mapPropsToValues: props => ({
    reciever: '',
    amount: '',
    memo: '',

    dialog: {
      tx: null,
      show: false
    }
  }),
  validationSchema: ({ navigation, accountStore }) => {
    const { symbol } = navigation.state.params;
    const { tokens } = accountStore;

    const availableAmount = tokens.find(token => token.symbol === symbol)
      .amount;

    return Yup.object().shape({
      reciever: Yup.string().required(),
      amount: Yup.string()
        .required()
        .matches(/^\d*\.?\d{1,4}$/, 'Please enter valid amount')
        .test(
          'larger-than-available',
          'Insufficient amount of token',
          value => parseFloat(value) <= availableAmount
        ),
      memo: Yup.string()
    });
  },
  handleSubmit: async (values, { props, setSubmitting, setFieldValue }) => {
    const { navigation, accountStore } = props;
    const { symbol } = navigation.state.params;

    navigation.navigate('ConfirmPin', {
      pinProps: {
        titleEnter: `Transfer ${values.amount} ${symbol} by entering PIN code`
      },
      // when PIN matched
      async cb() {
        const tx = await accountStore.transfer({ ...values, symbol });
        setSubmitting(false);
        // show result dialog
        setFieldValue('dialog', {
          tx,
          show: true
        });
      }
    });
  }
})
export class TransferScreen extends Component {
  viewHistory() {
    this.hideDialog();
    this.props.navigation.replace('TransactionDetail', {
      txId: this.props.values.dialog.tx.transaction_id
    });
  }

  confirmDialog() {
    this.hideDialog();
    this.props.navigation.navigate('Account');
  }

  hideDialog() {
    this.props.setFieldValue('dialog', {
      tx: null,
      show: false
    });
  }

  render() {
    const {
      navigation,
      accountStore,

      values,
      errors,
      touched,
      setFieldValue,
      setFieldTouched,
      handleSubmit,
      isSubmitting
    } = this.props;

    const { symbol } = navigation.state.params;
    const { tokens } = accountStore;

    const availableAmount = tokens.find(token => token.symbol === symbol)
      .amount;

    const ResultDialog = () => (
      <Portal>
        <Dialog visible={values.dialog.show}>
          <Dialog.Title>Transfer succeed</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              {values.amount} {symbol} transfered to {values.reciever}
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => this.viewHistory()}>View history</Button>
            <Button onPress={() => this.confirmDialog()}>Confirm</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );

    return (
      <View style={HomeStyle.container}>
        <SafeAreaView style={HomeStyle.container}>
          <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.goBack(null)} />
            <Appbar.Content title="Transfer" />
          </Appbar.Header>

          <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1, paddingHorizontal: 15 }}>
              <TextField
                label="Transfer amount"
                keyboardType="numeric"
                value={values.amount}
                title={`You have ${availableAmount} ${symbol}`}
                error={touched.amount && errors.amount}
                onChangeText={_ => {
                  setFieldTouched('amount', true);
                  setFieldValue('amount', _);
                }}
              />

              <TextField
                label="Reciever"
                value={values.reciever}
                error={touched.reciever && errors.reciever}
                onChangeText={_ => {
                  setFieldTouched('reciever', true);
                  setFieldValue('reciever', _);
                }}
              />

              <TextField
                label="Memo (optional)"
                value={values.memo}
                error={touched.memo && errors.memo}
                onChangeText={_ => {
                  setFieldTouched('memo', true);
                  setFieldValue('memo', _);
                }}
              />
            </ScrollView>

            <Button
              mode="contained"
              style={{
                margin: 15,
                padding: 5
              }}
              loading={isSubmitting}
              onPress={() => handleSubmit()}
            >
              Transfer
            </Button>
          </KeyboardAvoidingView>

          <ResultDialog />
        </SafeAreaView>
      </View>
    );
  }
}
