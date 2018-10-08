import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Appbar, Divider, List } from 'react-native-paper';
import moment from 'moment';

import HomeStyle from '../../../styles/HomeStyle';
import eosApi from '../../../utils/eosApi';

@inject('userStore')
@observer
export class TransactionDetailScreen extends Component {
  moveScreen = routeName => this.props.navigation.navigate(routeName);

  constructor() {
    super();

    this.state = {
      fetched: false,
      info: null
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const txId = navigation.state.params.txId;
    const transaction = await eosApi.transactions.get({ id: txId });
    console.log(transaction);
    this.setState({ fetched: true, info: transaction });
  }

  render() {
    const { navigation } = this.props;
    const { fetched, info } = this.state;

    return (
      <View style={HomeStyle.container}>
        <SafeAreaView>
          <Appbar.Header>
            <Appbar.Content
              title={'Transaction'}
              subtitle={navigation.state.params.txId}
            />
            <Appbar.Action
              icon="add"
              onPress={() => this.moveScreen('AddAccount')}
            />
          </Appbar.Header>
          <ScrollView style={{ padding: 15 }}>
            <View>
              <Text style={{ fontWeight: 'bold' }}>Transaction ID</Text>
              <Text>{navigation.state.params.txId}</Text>
            </View>
            <View>
              <Text style={{ fontWeight: 'bold' }}>Block Num</Text>
              <Text>{info && info.block_num}</Text>
            </View>
            <View>
              <Text style={{ fontWeight: 'bold' }}>Block Time</Text>
              <Text>{info && moment(info.block_time).fromNow()}</Text>
            </View>
            <View>
              <Text style={{ fontWeight: 'bold' }}>CPU Usage</Text>
              <Text>{info && info.trx.receipt.cpu_usage_us} us</Text>
            </View>
            <View>
              <Text style={{ fontWeight: 'bold' }}>Net Usage</Text>
              <Text>{info && info.trx.receipt.net_usage_words} words</Text>
            </View>
            <Divider />
            <View>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Actions</Text>
              {fetched &&
                info &&
                info.trx.trx.actions.map((action, i) => (
                  <View key={i}>
                    <View>
                      <Text style={{ fontWeight: 'bold' }}>{`${
                        action.account
                      }::${action.name}`}</Text>
                    </View>
                    <View>
                      {action.authorization.map((auth, i) => (
                        <Text key={i}>{`${auth.actor}@${
                          auth.permission
                        }`}</Text>
                      ))}
                    </View>
                    <View>
                      <Text style={{ color: 'gray' }}>
                        {JSON.stringify(action.data)}
                      </Text>
                    </View>
                  </View>
                ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
