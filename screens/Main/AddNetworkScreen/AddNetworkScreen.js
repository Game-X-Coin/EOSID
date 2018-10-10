import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { TextField } from 'react-native-material-textfield';
import { withFormik } from 'formik';
import * as Yup from 'yup';

import { NetworkError } from '../../../db';

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
      <View style={HomeStyle.container}>
        <SafeAreaView style={HomeStyle.container}>
          <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.goBack(null)} />
            <Appbar.Content title={'Add custom network'} />
          </Appbar.Header>

          <ScrollView style={HomeStyle.container}>
            <View style={{ paddingHorizontal: 15 }}>
              <TextField
                label="Name"
                value={values.name}
                error={touched.name && errors.name}
                onChangeText={_ => {
                  setFieldTouched('name', true);
                  setFieldValue('name', _);
                }}
              />

              <TextField
                label="Url"
                value={values.url}
                error={touched.url && errors.url}
                onChangeText={_ => {
                  setFieldTouched('url', true);
                  setFieldValue('url', _);
                }}
              />

              <Button
                mode="contained"
                style={{ padding: 5, marginTop: 15 }}
                loading={isSubmitting}
                onPress={() => handleSubmit()}
              >
                Add network
              </Button>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
