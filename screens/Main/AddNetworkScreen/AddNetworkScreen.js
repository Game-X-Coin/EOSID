import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { SafeAreaView, Keyboard } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { TextField } from 'react-native-material-textfield';
import { withFormik } from 'formik';
import * as Yup from 'yup';

import { NetworkError } from '../../../db';

import { KeyboardAvoidingView, ScrollView } from '../../../components/View';

import HomeStyle from '../../../styles/HomeStyle';
import { DialogIndicator } from '../../../components/Indicator';

@inject('networkStore')
@observer
@withFormik({
  mapPropsToValues: props => ({
    name: '',
    url: '',
    showDialog: false
  }),
  validationSchema: props => {
    const { InvalidUrl, RequiredFields } = NetworkError;

    return Yup.object().shape({
      name: Yup.string().required(RequiredFields.errors.name),
      url: Yup.string()
        .required(RequiredFields.errors.url)
        .url(InvalidUrl.errors.url)
    });
  },
  handleSubmit: async (
    values,
    {
      props: { networkStore, navigation },
      setSubmitting,
      setErrors,
      setFieldValue
    }
  ) => {
    try {
      Keyboard.dismiss();
      // show loading dialog
      setFieldValue('showDialog', true);

      await networkStore.addNetwork({
        name: values.name,
        chainURL: values.url,
        networkURL: values.url
      });

      navigation.navigate('SettingsNetwork');
    } catch (error) {
      setErrors({ message: error.message, ...error.errors });
      setSubmitting(false);
    } finally {
      // hide loading dialog
      setFieldValue('showDialog', false);
    }
  }
})
export class AddNetworkScreen extends Component {
  addNetwork = network => {};

  render() {
    const {
      navigation,

      values,
      errors,
      touched,
      setFieldValue,
      setFieldTouched,
      handleSubmit
    } = this.props;

    return (
      <SafeAreaView style={HomeStyle.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack(null)} />
          <Appbar.Content title="Add Network" />
        </Appbar.Header>

        <DialogIndicator
          visible={values.showDialog}
          title="Preparing to add custom network..."
        />

        <KeyboardAvoidingView>
          <ScrollView style={{ paddingHorizontal: 20 }}>
            <TextField
              autoFocus
              label="Name"
              title="Name to identify your network"
              value={values.name}
              error={touched.name && errors.name}
              onChangeText={_ => {
                setFieldTouched('name', true);
                setFieldValue('name', _);
              }}
            />

            <TextField
              label="URL"
              value={values.url}
              error={touched.url && errors.url}
              onChangeText={_ => {
                setFieldTouched('url', true);
                setFieldValue('url', _);
              }}
            />
          </ScrollView>

          <Button
            mode="contained"
            style={{ padding: 5, borderRadius: 0 }}
            onPress={handleSubmit}
          >
            Add network
          </Button>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}
