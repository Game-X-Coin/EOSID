import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Appbar, Button } from 'react-native-paper';
import { withFormik } from 'formik';
import * as Yup from 'yup';

import { DialogIndicator } from '../../../components/Indicator';
import {
  KeyboardAvoidingView,
  ScrollView,
  BackgroundView
} from '../../../components/View';
import { TextField } from '../../../components/TextField';
import { SelectField } from '../../../components/SelectField';

import { Theme } from '../../../constants';

@inject('accountStore')
@observer
@withFormik({
  mapPropsToValues: ({
    navigation: {
      state: { params = {} }
    }
  }) => ({
    receiver: params.receiver,
    amount: '',
    symbol: params.symbol,
    memo: '',

    showDialog: false
  }),
  validationSchema: ({ accountStore }) => {
    const { tokens } = accountStore;

    return Yup.lazy(values =>
      Yup.object().shape({
        amount: Yup.string()
          .matches(/^\d*\.?\d{1,4}$/, 'Please enter valid amount')
          .test(
            'zero',
            'Please enter more than zero',
            value => value && parseFloat(value) > 0
          )
          .test(
            'larger-than-available',
            'You have entered more than you have',
            value => {
              const availableAmount = tokens[values.symbol].amount;

              return value && parseFloat(value) <= parseFloat(availableAmount);
            }
          ),
        memo: Yup.string().max(256)
      })
    );
  },
  handleSubmit: async (
    values,
    { props: { navigation, accountStore }, setSubmitting, setFieldValue }
  ) => {
    const { tokens } = accountStore;
    const token = tokens[values.symbol];
    const fixedAmount = parseFloat(values.amount).toFixed(token.precision);

    navigation.navigate('ConfirmPin', {
      pinProps: {
        title: 'Confirm Transfer',
        description: `Transfer ${fixedAmount} ${values.symbol}`
      },
      async cb(pincode) {
        // show transfer loading dialog
        setFieldValue('showDialog', true);

        try {
          const result = await accountStore.transfer({
            ...values,
            account: token.code,
            pincode
          });

          navigation.navigate('TransferResult', {
            ...values,
            amount: fixedAmount,
            result
          });
        } catch ({ message }) {
          navigation.navigate('ShowError', {
            title: 'Transfer Failed',
            description: 'Please check the error, it may be a network error.',
            error: message
          });
        } finally {
          // hide dialog
          setFieldValue('showDialog', false);
        }
      }
    });
  }
})
export class TransferAmountScreen extends Component {
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
      isValid
    } = this.props;

    const { tokens } = accountStore;

    const availableAmount = tokens[values.symbol].amount;

    const tokenData = Object.keys(tokens).map(symbol => ({
      value: symbol
    }));

    return (
      <BackgroundView>
        <Appbar.Header
          style={{ backgroundColor: Theme.header.backgroundColor }}
        >
          <Appbar.BackAction onPress={() => navigation.goBack(null)} />
          <Appbar.Content title="Transfer" />
        </Appbar.Header>

        <DialogIndicator
          visible={values.showDialog}
          title="Preparing to transfer..."
        />

        <KeyboardAvoidingView>
          <ScrollView
            style={{
              margin: Theme.innerSpacing
            }}
          >
            <TextField
              label="Receiver"
              value={values.receiver}
              editable={false}
              onPress={() => navigation.goBack(null)}
            />

            <TextField
              autoFocus
              label="Transfer Amount"
              textAlign="right"
              keyboardType="numeric"
              value={values.amount}
              info={`${availableAmount} ${values.symbol} available`}
              error={touched.amount && errors.amount}
              onChangeText={_ => {
                setFieldTouched('amount', true);
                setFieldValue('amount', _);
              }}
              prefixComp={
                <SelectField
                  data={tokenData}
                  value={values.symbol}
                  error={touched.amount && errors.amount}
                  onChange={_ => setFieldValue('symbol', _)}
                  containerStyle={{
                    marginVertical: 0,
                    width: values.symbol.length * 10 + 60
                  }}
                />
              }
            />

            <TextField
              multiline
              label="Memo (optional)"
              info={`${values.memo.length} / 256`}
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
              padding: 5,
              borderRadius: 0
            }}
            disabled={!isValid}
            onPress={handleSubmit}
          >
            Next
          </Button>
        </KeyboardAvoidingView>
      </BackgroundView>
    );
  }
}
