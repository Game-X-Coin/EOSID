import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react/native';
import Pincode from '@haskkor/react-native-pincode';
import { Appbar } from 'react-native-paper';

@inject('userStore')
@observer
export class ConfirmPinScreen extends Component {
  @observable
  pinStatus = 'initial';

  confirmPin = async pincode => {
    const { userStore, navigation } = this.props;

    try {
      await userStore.signIn({ pincode });
      navigation.state.params.cb();
      navigation.goBack(null);
    } catch (error) {
      this.pinStatus = 'failure';
    }
  };

  render() {
    const { navigation } = this.props;
    const { pinProps = {} } = navigation.state.params;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack(null)} />
        </Appbar.Header>

        <Pincode
          touchIDDisabled
          status="enter"
          storedPin="____"
          pinStatus={this.pinStatus}
          handleResultEnterPin={this.confirmPin}
          {...pinProps}
        />
      </SafeAreaView>
    );
  }
}
