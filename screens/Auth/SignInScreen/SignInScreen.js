import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react/native';
import { Appbar } from 'react-native-paper';
import Pincode from '@haskkor/react-native-pincode';

@inject('userStore')
@observer
export class SignInScreen extends Component {
  @observable
  pinStatus = 'initial';

  signIn = async pincode => {
    const { userStore, navigation } = this.props;

    try {
      await userStore.signIn({ pincode });
      navigation.navigate('Account');
    } catch (error) {
      this.pinStatus = 'failure';
    }
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Appbar.Header>
          <Appbar.BackAction
            onPress={() => this.props.navigation.goBack(null)}
          />
          <Appbar.Content title="Sign in" />
        </Appbar.Header>

        <Pincode
          touchIDDisabled
          status="enter"
          storedPin="____"
          pinStatus={this.pinStatus}
          handleResultEnterPin={this.signIn}
        />
      </SafeAreaView>
    );
  }
}
