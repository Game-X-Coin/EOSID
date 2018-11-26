import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Pincode } from './Pincode';
import { Appbar } from 'react-native-paper';
import { DarkTheme } from '../../constants';

@observer
export class ConfirmPincode extends Component {
  @observable
  status = 'initial';

  confirmPincode(v) {
    this.props.onEnter &&
      this.props.onEnter(v, { setFailure: () => this.changeStatus('failure') });
  }

  changeStatus(status) {
    this.status = status;
  }

  render() {
    const {
      title = 'Confirm Password',
      description = 'Confirm your password.',
      backAction
    } = this.props;

    return (
      <React.Fragment>
        <Appbar.Header
          style={{
            backgroundColor: DarkTheme.header.backgroundColor,
            elevation: 0
          }}
          dark
        >
          {backAction && <Appbar.BackAction onPress={backAction} />}
          <Appbar.Content title={title} />
        </Appbar.Header>

        <Pincode
          status={this.status}
          description={description}
          onChange={() => this.changeStatus('initial')}
          onEnter={v => this.confirmPincode(v)}
        />
      </React.Fragment>
    );
  }
}
