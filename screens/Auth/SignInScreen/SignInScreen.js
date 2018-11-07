import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';

import { ConfirmPincode } from '../../../components/Pincode';

@inject('userStore')
@observer
export class SignInScreen extends Component {
  signIn = async (pincode, { setFailure }) => {
    const { userStore, navigation } = this.props;

    try {
      await userStore.signIn({ pincode });
      navigation.navigate('Account');
    } catch (error) {
      setFailure();
    }
  };

  render() {
    return <ConfirmPincode onEnter={this.signIn} />;
  }
}
