import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';

import { ConfirmPincode } from '../../../components/Pincode';

@inject('pincodeStore')
@observer
export class ConfirmAppPinScreen extends Component {
  confirmPin = async (pincode, { setFailure }) => {
    const { pincodeStore, navigation } = this.props;

    try {
      await pincodeStore.validateAppPincode(pincode);
      navigation.goBack(null);

      try {
        navigation.state.params && navigation.state.params.cb();
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      setFailure();
    }
  };

  render() {
    const { navigation } = this.props;
    const { params } = navigation.state || {};

    return (
      <ConfirmPincode
        description="Confirm your app password."
        onEnter={this.confirmPin}
        backAction={params.cantBack ? null : () => navigation.goBack(null)}
      />
    );
  }
}
