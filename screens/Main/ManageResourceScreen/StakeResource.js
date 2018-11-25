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
  mapPropsToValues: ({ accountStore: { tokens } }) => {
    return {
      amount: '',
      stakableAmount: tokens.EOS ? parseFloat(tokens.EOS) : 0,

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
                value && parseFloat(value) <= parseFloat(values.stakableAmount)
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
        title: 'Confirm Stake',
        description: `Stake ${amount} EOS for ${resourceName}`
      },
      // when PIN matched
      cb: async pincode => {
        setFieldValue('dialogVisible', true);

        try {
          await accountStore.manageResource({
            cpu: resourceName === 'CPU' ? amount : 0,
            net: resourceName === 'Network' ? amount : 0,
            pincode,
            isStaking: true
          });

          navigation.navigate('ShowSuccess', {
            title: 'Stake Resource Succeed',
            description: `Successfully stake ${amount} EOS for ${resourceName}`
          });
        } catch ({ message }) {
          navigation.navigate('ShowError', {
            title: 'Stake Resource Failed',
            description: `Failed to stake ${resourceName}, Please check the error.`,
            error: message
          });
        } finally {
          setFieldValue('dialogVisible', false);
        }
      }
    });
  }
})
export class StakeResource extends Component {
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
          title="Preparing to stake resource..."
        />

        <KeyboardAvoidingView>
          <ScrollView style={{ margin: Theme.innerSpacing }}>
            <ResourceTextField
              label="Stakable Amount"
              info={`${values.stakableAmount.toFixed(4)} EOS available`}
              value={values.amount}
              error={touched.amount && errors.amount}
              onChangeText={_ => {
                setFieldTouched('amount', true);
                setFieldValue('amount', _);
              }}
              onChangePercent={percent =>
                setFieldValue(
                  'amount',
                  (values.stakableAmount * percent).toFixed(4)
                )
              }
            />

            <Paragraph style={{ color: Theme.primary }}>
              You can unstake the resources at any time, but there will be a
              three-day waiting period
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
