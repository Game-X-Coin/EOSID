import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { SafeAreaView, View } from 'react-native';
import {
  Appbar,
  Button,
  Divider,
  Text,
  Caption,
  TouchableRipple
} from 'react-native-paper';
import { TextField } from 'react-native-material-textfield';

import api from '../../../utils/eos/API';
import { TransferLogService } from '../../../services';

import { KeyboardAvoidingView, ScrollView } from '../../../components/View';

import HomeStyle from '../../../styles/HomeStyle';
import { Indicator } from '../../../components/Indicator';

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
    const { currentUserAccount } = this.props.accountStore;

    const logs = await TransferLogService.getTransferLogsByAcocuntId(
      currentUserAccount.id
    );

    // desc
    this.transferLogs = logs.reverse();
  }

  render() {
    return (
      <View>
        <View style={{ paddingHorizontal: 20 }}>
          <Text>Recent History</Text>
          <Divider style={{ marginVertical: 10 }} />
        </View>

        {this.transferLogs.map(log => (
          <TouchableRipple
            key={log.id}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 5,
              marginBottom: 5
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
                <Caption>{log.createdAt}</Caption>
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
      <SafeAreaView style={HomeStyle.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack(null)} />
          <Appbar.Content title="Receiver" />
        </Appbar.Header>

        <KeyboardAvoidingView>
          <ScrollView>
            <View style={{ padding: 20 }}>
              <TextField
                autoFocus
                label="Enter receiver's account"
                title="example: eosauthority"
                value={receiver}
                error={error}
                renderAccessory={() =>
                  loading && (
                    <View style={{ paddingHorizontal: 5 }}>
                      <Indicator size="small" />
                    </View>
                  )
                }
                onChangeText={v => this.onChangeReceiver(v)}
              />

              <Button
                mode="contained"
                style={{
                  marginVertical: 20,
                  padding: 5
                }}
                disabled={!receiver.length}
                onPress={() => !loading && !error && this.handleSubmit()}
              >
                Next
              </Button>
            </View>

            <TransferLogs
              onLogPress={log => this.onChangeReceiver(log.receiver)}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}
