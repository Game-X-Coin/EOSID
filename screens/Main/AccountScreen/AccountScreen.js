import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import {
  Appbar,
  Colors,
  Divider,
  List,
  ProgressBar,
  Title
} from 'react-native-paper';
import bytes from 'bytes';
import prettyMs from 'pretty-ms';

import HomeStyle from '../../../styles/HomeStyle';
import eosApi from '../../../utils/eosApi';

@inject('userStore')
@observer
export class AccountScreen extends Component {
  moveScreen = routeName => this.props.navigation.navigate(routeName);

  constructor() {
    super();

    this.state = {
      fetched: false,
      info: null,
      balances: null
    };
  }

  async componentDidMount() {
    const info = await eosApi.accounts.get({ account_name: 'indieveloper' });

    const balancesTemp =
      (await eosApi.currency.balance({
        account: 'indieveloper'
      })) || [];

    const balances = balancesTemp.map(balance => {
      const balancesTemp = balance.split(' ');
      return {
        amount: balancesTemp[0],
        symbol: balancesTemp[1]
      };
    });

    this.setState({
      fetched: true,
      balances,
      info
    });
  }

  prettyBytes(value) {
    return bytes(value, { unitSeparator: ' ', thousandsSeparator: ',' });
  }

  prettyTime(value) {
    return prettyMs(value * 0.001);
  }

  render() {
    const { fetched, balances, info } = this.state;

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
          <ScrollView style={HomeStyle.container} />
          <View style={HomeStyle.welcomeContainer}>
            {info && (
              <React.Fragment>
                <Title>Resources</Title>
                <View
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-around'
                  }}
                >
                  <View>
                    <Text style={{ fontWeight: 'bold' }}>CPU</Text>
                    <ProgressBar progress={0.5} color={Colors.red800} />
                    <Text>
                      {`${this.prettyTime(
                        info.cpu_limit.used
                      )} / ${this.prettyTime(info.cpu_limit.max)}`}
                    </Text>
                    <Text>
                      {`(${(info.cpu_weight * 0.0001).toFixed(2)} EOS)`}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ fontWeight: 'bold' }}>Network</Text>
                    <ProgressBar progress={0.5} color={Colors.green800} />
                    <Text>
                      {`${this.prettyBytes(
                        info.net_limit.used
                      )} / ${this.prettyBytes(info.net_limit.max)}`}
                    </Text>
                    <Text>
                      {`(${(info.net_weight * 0.0001).toFixed(2)} EOS)`}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ fontWeight: 'bold' }}>RAM</Text>
                    <ProgressBar progress={0.5} color={Colors.yellow800} />
                    <Text>{`${this.prettyBytes(
                      info.ram_usage
                    )} / ${this.prettyBytes(info.ram_quota)}`}</Text>
                  </View>
                </View>
              </React.Fragment>
            )}
            <Divider />
            {fetched &&
              balances && (
                <View>
                  <Title>Balances</Title>
                  <List.Section>
                    {balances.map((balance, i) => (
                      <List.Item
                        key={i}
                        title={balance.symbol}
                        description={`${balance.amount} ${balance.symbol}`}
                      />
                    ))}
                  </List.Section>
                </View>
              )}
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
