import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';

import { ConfirmPincode } from '../../../components/Pincode';

@inject('userStore')
@observer
export class ConfirmPinScreen extends Component {
  confirmPin = async (pincode, { setFailure }) => {
    const { userStore, navigation } = this.props;

    try {
      await userStore.signIn({ pincode });
      navigation.state.params && navigation.state.params.cb();
      navigation.goBack(null);
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
        backAction={() => this.props.navigation.goBack(null)}
        {...pinProps}
      />
    );
  }
}
