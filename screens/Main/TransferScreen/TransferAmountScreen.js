import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { SafeAreaView, View } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { TextField } from 'react-native-material-textfield';
import { Dropdown } from 'react-native-material-dropdown';
import { withFormik } from 'formik';
import * as Yup from 'yup';

import { DialogIndicator } from '../../../components/Indicator';
import { KeyboardAvoidingView, ScrollView } from '../../../components/View';

import HomeStyle from '../../../styles/HomeStyle';

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
              const availableAmount = tokens[values.symbol];

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
    const fixedAmount = parseFloat(values.amount).toFixed(4);

    navigation.navigate('ConfirmPin', {
      pinProps: {
        title: 'Confirm Transfer',
        description: `Transfer ${fixedAmount} ${values.symbol}`
      },
      async cb() {
        // show transfer loading dialog
        setFieldValue('showDialog', true);

        const result = await accountStore.transfer(values);

        // hide dialog
        setFieldValue('showDialog', false);

        if (result.code === 500) {
          navigation.navigate('ShowError', {
            title: 'Transfer Failed',
            description: 'Please check the error, it may be a network error.',
            error: result
          });
        } else {
          navigation.navigate('TransferResult', {
            ...values,
            amount: fixedAmount,
            result
          });
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

    const availableAmount = tokens[values.symbol];

    const tokenData = Object.keys(tokens).map(symbol => ({
      value: symbol
    }));

    return (
      <SafeAreaView style={HomeStyle.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack(null)} />
          <Appbar.Content title="Transfer" />
        </Appbar.Header>

        <DialogIndicator
          visible={values.showDialog}
          title="Preparing to transfer..."
        />

        <KeyboardAvoidingView>
          <ScrollView style={{ padding: 20 }}>
            <TextField
              label="Receiver"
              value={values.receiver}
              editable={false}
            />

            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <TextField
                  autoFocus
                  label="Enter transfer amount"
                  keyboardType="numeric"
                  value={values.amount}
                  title={`${availableAmount} ${values.symbol} available`}
                  error={touched.amount && errors.amount}
                  onChangeText={_ => {
                    setFieldTouched('amount', true);
                    setFieldValue('amount', _);
                  }}
                />
              </View>

              <View style={{ width: 90, marginLeft: 8 }}>
                <Dropdown
                  value={values.symbol}
                  data={tokenData}
                  onChangeText={_ => {
                    setFieldValue('symbol', _);
                  }}
                />
              </View>
            </View>

            <TextField
              multiline
              label="Enter memo (optional)"
              suffix={`${values.memo.length} / 256`}
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
            Transfer
          </Button>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}
