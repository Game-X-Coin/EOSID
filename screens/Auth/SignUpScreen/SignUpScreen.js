import React, { Component } from 'react';
import { View, SafeAreaView } from 'react-native';
// import { observer, inject } from 'mobx-react';

// import { UserError } from "../../../db"
/* 
import { Text } from "../../shared/text"
import { Screen } from "../../shared/screen"
import { Header } from "../../shared/header"
import { Button } from "../../shared/button"
import { TextField } from "../../shared/text-field"
import { Wallpaper } from "../../shared/wallpaper" */

// import { color, spacing } from "../../../theme"

export class SignUpScreen extends Component {
  goBack = () => this.props.navigation.goBack();

  render() {
    const {
      values,
      errors,
      touched,
      setFieldValue,
      setFieldTouched,
      handleSubmit,
      isSubmitting
    } = this.props;

    return (
      <View>
        <SafeAreaView>
          {/* <Text style={TITLE_WRAPPER}>
              <Text style={TITLE} tx="signUpScreen.title" />
            </Text>

            <TextField
              labelTx="signUpScreen.username"
              value={values.username}
              error={touched.username && errors.username}
              onChangeText={_ => {
                setFieldTouched("username", true)
                setFieldValue("username", _)
              }}
            />
            <TextField
              secureTextEntry
              labelTx="signUpScreen.password"
              value={values.password}
              error={touched.password && errors.password}
              onChangeText={_ => {
                setFieldTouched("password", true)
                setFieldValue("password", _)
              }}
            />

              <Button
                tx="signUpScreen.submit"
                disabled={Boolean(isSubmitting)}
                onPress={() => handleSubmit()}
              /> */}
        </SafeAreaView>
      </View>
    );
  }
}
