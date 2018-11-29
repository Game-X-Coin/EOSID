import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { View } from 'react-native';
import {
  Appbar,
  Button,
  Divider,
  Text,
  Caption,
  TouchableRipple
} from 'react-native-paper';
import moment from '../../../utils/moment';

import api from '../../../utils/eos/API';
import { TransferLogService } from '../../../services';
import { Theme } from '../../../constants';

import {
  KeyboardAvoidingView,
  ScrollView,
  BackgroundView
} from '../../../components/View';
import { TextField } from '../../../components/TextField';

const debounce = (func, wait) => {
  let timeout;

  return function() {
    const debounceFunc = () => func.apply(this, arguments);

    clearTimeout(timeout);
    timeout = setTimeout(debounceFunc, wait);
  };
};

@inject('accountStore')
@observer
export class TransferLogs extends Component {
  @observable
  transferLogs = [];

  async componentDidMount() {
    const { currentAccount } = this.props.accountStore;

    const logs = await TransferLogService.getTransferLogsByAcocuntId(
      currentAccount.id
    );

    // desc
    this.transferLogs = logs.reverse();
  }

  render() {
    return (
      <View style={{ paddingBottom: Theme.innerPadding }}>
        <View style={{ paddingHorizontal: Theme.innerSpacing }}>
          <Text>Recent History</Text>
          <Divider
            style={{ marginTop: 10, backgroundColor: Theme.palette.darkGray }}
          />
        </View>

        {this.transferLogs.map(log => (
          <TouchableRipple
            key={log.id}
            style={{
              paddingHorizontal: Theme.innerSpacing,
              paddingVertical: 10
            }}
            onPress={() => this.props.onLogPress(log)}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <View style={{ flex: 1 }}>
                <Text>{log.receiver}</Text>
                <Caption>{moment(log.createdAt).format('YYYY/MM/DD')}</Caption>
              </View>
              <Text style={{ fontSize: 15 }}>
                {log.amount} {log.symbol}
              </Text>
            </View>
          </TouchableRipple>
        ))}
      </View>
    );
  }
}

@observer
export class TransferScreen extends Component {
  @observable
  loading = false;

  @observable
  receiver = '';

  @observable
  error = '';

  componentDidMount() {
    this.checkReceiver = debounce(this.checkReceiver.bind(this), 500);
  }

  onChangeReceiver(v) {
    this.receiver = v;
    this.error = '';
    this.checkReceiver(v);
  }

  async checkReceiver(v) {
    this.loading = true;

    const result = await api.accounts.get({ account_name: v });

    if (result.error) {
      this.error = 'The account you entered does not exist.';
    }

    this.loading = false;
  }

  handleSubmit() {
    const { navigation } = this.props;
    const { symbol = 'EOS' } = navigation.state.params || {};

    navigation.navigate('TransferAmount', {
      receiver: this.receiver,
      symbol
    });
  }

  render() {
    const { navigation } = this.props;
    const { receiver, loading, error } = this;

    return (
      <BackgroundView>
        <Appbar.Header
          style={{ backgroundColor: Theme.header.backgroundColor }}
        >
          <Appbar.BackAction onPress={() => navigation.goBack(null)} />
          <Appbar.Content title="Transfer" />
        </Appbar.Header>

        <KeyboardAvoidingView>
          <ScrollView>
            <View
              style={{
                margin: Theme.innerSpacing
              }}
            >
              <TextField
                autoFocus
                label="Receiver's account"
                info={loading ? 'Searching account...' : ''}
                placeholder="iameosiduser"
                value={receiver}
                error={error}
                loading={loading}
                onChangeText={v => {
                  this.loading = true;
                  this.onChangeReceiver(v);
                }}
              />

              <Button
                mode="contained"
                style={{
                  marginBottom: 20,
                  padding: 5
                }}
                disabled={!receiver.length || loading || Boolean(error)}
                onPress={() => this.handleSubmit()}
              >
                Next
              </Button>
            </View>

            <TransferLogs
              onLogPress={log => {
                this.onChangeReceiver(log.receiver);
                this.handleSubmit();
              }}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </BackgroundView>
    );
  }
}
