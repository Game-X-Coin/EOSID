import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';

import { ConfirmPincode } from '../../../components/Pincode';

@inject('pincodeStore')
@observer
export class ConfirmPinScreen extends Component {
  confirmPin = async (pincode, { setFailure }) => {
    const { pincodeStore, navigation } = this.props;
    const { params } = navigation.state || {};

    try {
      await pincodeStore.validateAccountPincode(pincode);
      navigation.goBack(null);

      params.cb && params.cb(pincode);
    } catch (error) {
      setFailure();
    }
  };

  render() {
    const { navigation } = this.props;
    const pinProps = navigation.state.params
      ? navigation.state.params.pinProps
      : {};

    return (
      <ConfirmPincode
        onEnter={this.confirmPin}
        backAction={() => navigation.goBack(null)}
        {...pinProps}
      />
    );
  }
}
