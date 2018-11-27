import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Button, Paragraph } from 'react-native-paper';
import { withFormik } from 'formik';
import * as Yup from 'yup';

import { DialogIndicator } from '../../../components/Indicator';
import {
  KeyboardAvoidingView,
  ScrollView,
  BackgroundView
} from '../../../components/View';
import { Theme } from '../../../constants';
import { ResourceTextField } from './ResourceTextField';

@inject('accountStore')
@observer
@withFormik({
  enableReinitialize: true,
  mapPropsToValues: ({ navigation, accountStore: { info } }) => {
    const { resourceName } = navigation.state.params || {};
    const { total_resources: { cpu_weight = 0, net_weight = 0 } = {} } = info;

    // required resource amount for account
    const MIN_RESOURCE_AMOUNT = 0.1;

    const cpuAmount = parseFloat(cpu_weight) - MIN_RESOURCE_AMOUNT;
    const netAmount = parseFloat(net_weight) - MIN_RESOURCE_AMOUNT;

    return {
      amount: '',
      unstakableAmount: resourceName === 'CPU' ? cpuAmount : netAmount,

      dialogVisible: false
    };
  },
  validationSchema: () => {
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
              return (
                value &&
                parseFloat(value) <= parseFloat(values.unstakableAmount)
              );
            }
          )
      })
    );
  },
  handleSubmit: async (
    values,
    { props: { navigation, accountStore }, setFieldValue }
  ) => {
    const { resourceName } = navigation.state.params || {};

    const amount = parseFloat(values.amount).toFixed(4);

    navigation.navigate('ConfirmPin', {
      pinProps: {
        title: 'Confirm Unstake',
        description: `Unstake ${amount} EOS from ${resourceName}`
      },
      // when PIN matched
      cb: async pincode => {
        setFieldValue('dialogVisible', true);

        try {
          await accountStore.manageResource({
            cpu: resourceName === 'CPU' ? amount : 0,
            net: resourceName === 'Network' ? amount : 0,
            pincode
          });

          navigation.navigate('ShowSuccess', {
            title: 'Unstake Resource Succeed',
            description: `Successfully unstake ${amount} EOS from ${resourceName}`
          });
        } catch ({ message }) {
          navigation.navigate('ShowError', {
            title: 'Unstake Resource Failed',
            description: `Failed to unstake ${resourceName}, Please check the error.`,
            error: message
          });
        } finally {
          setFieldValue('dialogVisible', false);
        }
      }
    });
  }
})
export class UnstakeResource extends Component {
  render() {
    const {
      values,
      errors,
      touched,
      setFieldValue,
      setFieldTouched,
      handleSubmit,
      isValid
    } = this.props;

    return (
      <BackgroundView>
        <DialogIndicator
          visible={values.dialogVisible}
          title="Preparing to unstake resource..."
        />

        <KeyboardAvoidingView>
          <ScrollView style={{ margin: Theme.innerSpacing }}>
            <ResourceTextField
              label="Unstakable Amount"
              info={`${values.unstakableAmount.toFixed(4)} EOS available`}
              value={values.amount}
              error={touched.amount && errors.amount}
              onChangeText={_ => {
                setFieldTouched('amount', true);
                setFieldValue('amount', _);
              }}
              onChangePercent={percent =>
                setFieldValue(
                  'amount',
                  (values.unstakableAmount * percent).toFixed(4)
                )
              }
            />
            <Paragraph style={{ color: Theme.pallete.primary }}>
              All resources must have a minimum stake amount (0.1 EOS)
            </Paragraph>
            <Paragraph style={{ color: Theme.pallete.primary }}>
              All the refunding EOS will be returned 3 days after the last
              unstake
            </Paragraph>
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
            Continue
          </Button>
        </KeyboardAvoidingView>
      </BackgroundView>
    );
  }
}
