import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Appbar, List } from 'react-native-paper';

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
      balances
    });
  }

  render() {
    const { fetched, balances } = this.state;

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
            {fetched &&
              balances && (
                <List.Section>
                  {balances.map((balance, i) => (
                    <List.Item
                      key={i}
                      title={balance.symbol}
                      description={`${balance.amount} ${balance.symbol}`}
                    />
                  ))}
                </List.Section>
              )}
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
