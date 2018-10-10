import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import {
  Appbar,
  Colors,
  ProgressBar,
  Title,
  Text,
  Card,
  Divider
} from 'react-native-paper';
import { LinearGradient } from 'expo';
import bytes from 'bytes';
import prettyMs from 'pretty-ms';

import HomeStyle from '../../../styles/HomeStyle';
import eosApi from '../../../utils/eosApi';

@inject('accountStore')
@observer
export class AccountScreen extends Component {
  @observable
  account = {};

  @observable
  balances = [];

  @observable
  fetched = false;

  async componentDidMount() {
    const { currentUserAccount } = this.props.accountStore;

    if (!currentUserAccount) {
      return;
    }

    const [account, balances] = await Promise.all([
      eosApi.accounts.get({ account_name: currentUserAccount.name }),
      eosApi.currency.balance({ account: currentUserAccount.name })
    ]);

    const transformBalances = balances.map(balance => {
      const [amount, symbol] = balance.split(' ');

      return {
        amount,
        symbol
      };
    });

    this.account = account;
    this.balances = transformBalances;
    this.fetched = true;
  }

  moveScreen = routeName => this.props.navigation.navigate(routeName);

  prettyBytes(value) {
    return bytes(value, { thousandsSeparator: ',' });
  }

  prettyTime(value) {
    return prettyMs(value * 0.001);
  }

  render() {
    const { currentUserAccount } = this.props.accountStore;

    const NoAccount = () => (
      <View>
        <Title style={{ marginBottom: 12 }}>
          You do not have any accounts added.
        </Title>
        <Card onPress={() => this.moveScreen('AddAccount')}>
          <LinearGradient
            colors={[Colors.purple200, Colors.purple900]}
            start={[1, 0]}
            end={[0, 1]}
            style={{
              padding: 20,
              borderRadius: 5
            }}
          >
            <Title style={{ color: '#fff', fontSize: 25 }}>
              Add eos account
            </Title>

            <Text style={{ color: '#fff', fontSize: 15 }}>
              add eos account by private key
            </Text>
          </LinearGradient>
        </Card>
      </View>
    );

    const HaveAccount = () => {
      const {
        account_name,
        core_liquid_balance,
        cpu_limit,
        cpu_weight,
        net_limit,
        net_weight,
        ram_usage,
        ram_quota
      } = this.account;

      return (
        <View>
          <LinearGradient
            colors={[Colors.grey700, Colors.grey900]}
            start={[1, 0]}
            end={[0, 1]}
            style={{
              marginTop: 20,
              padding: 20,
              borderRadius: 5
            }}
          >
            <Text style={{ color: '#fff', fontSize: 17, paddingBottom: 15 }}>
              {account_name}
            </Text>
            <Title style={{ color: '#fff', fontSize: 25 }}>
              {core_liquid_balance}
            </Title>
          </LinearGradient>

          <View style={{ marginTop: 25, paddingHorizontal: 5 }}>
            <View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold' }}>CPU</Text>
                  {` (${this.prettyTime(cpu_limit.used)}/${this.prettyTime(
                    cpu_limit.max
                  )})`}
                </Text>

                <Text>{(cpu_weight * 0.0001).toFixed(2)} EOS</Text>
              </View>
              <ProgressBar
                progress={cpu_limit.used / cpu_limit.max}
                color={Colors.red800}
              />
            </View>

            <View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold' }}>Network</Text>
                  {` (${this.prettyTime(net_limit.used)}/${this.prettyTime(
                    net_limit.max
                  )})`}
                </Text>

                <Text>{(net_weight * 0.0001).toFixed(2)} EOS</Text>
              </View>
              <ProgressBar
                progress={net_limit.used / net_limit.max}
                color={Colors.cyan800}
              />
            </View>

            <View>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>RAM</Text>
                {` (${this.prettyBytes(ram_usage)}/${this.prettyBytes(
                  ram_quota
                )})`}
              </Text>
              <ProgressBar
                progress={ram_usage / ram_quota}
                color={Colors.purple800}
              />
            </View>
          </View>

          <Divider style={{ marginVertical: 15 }} />

          <View style={{ paddingHorizontal: 5 }}>
            <Text
              style={{ marginBottom: 15, fontSize: 17, fontWeight: 'bold' }}
            >
              Tokens
            </Text>
            {this.balances.map((balance, i) => (
              <View
                key={i}
                style={{ flexDirection: 'row', paddingVertical: 10 }}
              >
                <Text style={{ flex: 1, fontSize: 17 }}>{balance.symbol}</Text>
                <Text style={{ fontSize: 17 }}>{balance.amount}</Text>
              </View>
            ))}
          </View>
        </View>
      );
    };

    return (
      <View style={HomeStyle.container}>
        <SafeAreaView>
          <Appbar.Header>
            <Appbar.Content title={'Account'} />
            <Appbar.Action
              icon="add"
              onPress={() => this.moveScreen('AddAccount')}
            />
          </Appbar.Header>

          <ScrollView style={{ paddingHorizontal: 20 }}>
            {currentUserAccount ? (
              this.fetched ? (
                <HaveAccount />
              ) : null
            ) : (
              <NoAccount />
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
