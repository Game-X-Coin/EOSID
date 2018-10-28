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
                <Text>{log.reciever}</Text>
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

@inject('networkStore')
@observer
export class TransferScreen extends Component {
  @observable
  loading = false;

  @observable
  reciever = '';

  @observable
  error = '';

  componentDidMount() {
    this.checkReciever = debounce(this.checkReciever.bind(this), 500);
  }

  onChangeReciever(v) {
    this.reciever = v;
    this.error = '';
    this.checkReciever(v);
  }

  async checkReciever(v) {
    try {
      this.loading = true;
      await this.props.networkStore.eos.accounts.get(v);
    } catch (error) {
      this.error = 'The account you entered does not exist.';
    } finally {
      this.loading = false;
    }
  }

  handleSubmit() {
    const { navigation } = this.props;
    const { symbol = 'EOS' } = navigation.state.params || {};

    navigation.navigate('TransferAmount', {
      reciever: this.reciever,
      symbol
    });
  }

  render() {
    const { navigation } = this.props;
    const { reciever, loading, error } = this;

    return (
      <SafeAreaView style={HomeStyle.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack(null)} />
          <Appbar.Content title="Reciever" />
        </Appbar.Header>

        <KeyboardAvoidingView>
          <ScrollView>
            <View style={{ padding: 20 }}>
              <TextField
                autoFocus
                label="Enter reciever's account"
                title="example: eosauthority"
                value={reciever}
                error={error}
                renderAccessory={() =>
                  loading && (
                    <View style={{ paddingHorizontal: 5 }}>
                      <Indicator size="small" />
                    </View>
                  )
                }
                onChangeText={v => this.onChangeReciever(v)}
              />

              <Button
                mode="contained"
                style={{
                  marginVertical: 20,
                  padding: 5
                }}
                disabled={!reciever.length}
                onPress={() => !loading && !error && this.handleSubmit()}
              >
                Next
              </Button>
            </View>

            <TransferLogs
              onLogPress={log => this.onChangeReciever(log.reciever)}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}