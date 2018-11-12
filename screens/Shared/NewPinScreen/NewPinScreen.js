import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';

import { NewPincode } from '../../../components/Pincode';

@inject('pincodeStore')
@observer
export class NewPinScreen extends Component {
  newPin = async pincode => {
    const { pincodeStore, navigation } = this.props;
    const { params } = navigation.state || {};

    try {
      await pincodeStore.saveAccountPincode(pincode);
      params.cb && params.cb();
      navigation.goBack(null);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { navigation } = this.props;
    const pinProps = navigation.state.params
      ? navigation.state.params.pinProps
      : {};

    return (
      <NewPincode
        onEnter={this.newPin}
        backAction={() => navigation.goBack(null)}
        {...pinProps}
      />
    );
  }
}
