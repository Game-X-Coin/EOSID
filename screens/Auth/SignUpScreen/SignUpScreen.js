import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import { SafeAreaView } from 'react-native';
import { Appbar } from 'react-native-paper';
import Pincode from '@haskkor/react-native-pincode';

@inject('userStore')
@observer
export class SignUpScreen extends Component {
  storePincode = async pincode => {
    const { userStore, navigation } = this.props;

    try {
      await userStore.signUp({ pincode });
      navigation.navigate('Welcome');
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Appbar.Header>
          <Appbar.BackAction
            onPress={() => this.props.navigation.goBack(null)}
          />
          <Appbar.Content title="Sign up" />
        </Appbar.Header>

        <Pincode status="choose" storePin={this.storePincode} />
      </SafeAreaView>
    );
  }
}
