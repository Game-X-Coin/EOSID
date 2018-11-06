import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';

import { NewPincode } from '../../../components/Pincode';

@inject('pincodeStore')
@observer
export class NewAppPinScreen extends Component {
  newPin = async pincode => {
    const { pincodeStore, navigation } = this.props;

    try {
      await pincodeStore.saveAppPincode(pincode);
      navigation.state.params && navigation.state.params.cb();
      navigation.goBack(null);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <NewPincode
        description="Set password to secure your app."
        onEnter={this.newPin}
        backAction={() => this.props.navigation.goBack(null)}
      />
    );
  }
}
