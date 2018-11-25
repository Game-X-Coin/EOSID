import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';

import { NewPincode } from '../../../components/Pincode';

@inject('pincodeStore')
@observer
export class NewAppPinScreen extends Component {
  newPin = async pincode => {
    const { pincodeStore, navigation } = this.props;
    const { params } = navigation.state || {};

    try {
      await pincodeStore.saveAppPincode(pincode);
      params.cb && params.cb(pincode);
      navigation.goBack(null);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { navigation } = this.props;

    return (
      <NewPincode
        description="Set password to secure your app."
        onEnter={this.newPin}
        backAction={() => navigation.goBack(null)}
      />
    );
  }
}
