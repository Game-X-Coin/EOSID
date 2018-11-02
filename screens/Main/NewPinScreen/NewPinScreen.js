import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';

import { NewPincode } from '../../../components/Pincode';

@inject('pincodeStore')
@observer
export class NewPinScreen extends Component {
  newPin = async pincode => {
    const { pincodeStore, navigation } = this.props;

    try {
      await pincodeStore.saveAccountPincode(pincode);
    } catch (error) {
      console.log(error);
    } finally {
      navigation.state.params && navigation.state.params.cb();
      navigation.goBack(null);
    }
  };

  render() {
    return (
      <NewPincode
        onEnter={this.newPin}
        backAction={() => this.props.navigation.goBack(null)}
      />
    );
  }
}
