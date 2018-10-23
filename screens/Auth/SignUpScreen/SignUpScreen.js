import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';

import { NewPincode } from '../../../components/Pincode';

@inject('userStore')
@observer
export class SignUpScreen extends Component {
  signUp = async pincode => {
    const { userStore, navigation } = this.props;

    await userStore.signUp({ pincode });
    navigation.navigate('ImportAccount', { isSignUp: true });
  };

  render() {
    return (
      <NewPincode
        onEnter={this.signUp}
        backAction={() => this.props.navigation.goBack(null)}
      />
    );
  }
}
