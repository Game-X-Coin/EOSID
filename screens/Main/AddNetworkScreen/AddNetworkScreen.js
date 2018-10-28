import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { SafeAreaView } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { TextField } from 'react-native-material-textfield';
import { withFormik } from 'formik';
import * as Yup from 'yup';

import { NetworkError } from '../../../db';

import { KeyboardAvoidingView, ScrollView } from '../../../components/View';

import HomeStyle from '../../../styles/HomeStyle';

@inject('networkStore')
@observer
@withFormik({
  mapPropsToValues: props => ({
    name: '',
    url: ''
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
  handleSubmit: async (values, { props, setSubmitting, setErrors }) => {
    try {
      await props.networkStore.addNetwork({
        name: values.name,
        url: values.url
      });

      props.navigation.navigate('SettingsNetwork');
    } catch (error) {
      setErrors({ message: error.message, ...error.errors });
      setSubmitting(false);
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
      handleSubmit,
      isSubmitting
    } = this.props;

    return (
      <SafeAreaView style={HomeStyle.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack(null)} />
          <Appbar.Content title="Add Network" />
        </Appbar.Header>

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
            loading={isSubmitting}
            onPress={handleSubmit}
          >
            Add network
          </Button>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}
