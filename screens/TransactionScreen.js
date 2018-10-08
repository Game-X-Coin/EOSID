import React, { Component } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import moment from 'moment';

import HomeStyle from '../styles/HomeStyle';
import eosApi from '../utils/eosApi';

export default class TransactionScreen extends Component {
  constructor() {
    super();

    this.state = {
      fetched: false,
      actions: null
    };
  }
  async componentDidMount() {
    const actions =
      ((await eosApi.actions.gets({ account_name: 'indieveloper' })) || {})
        .actions || [];
    this.setState({
      fetched: true,
      actions
    });
  }
  render() {
    const { fetched, actions } = this.state;
    return (
      <View style={HomeStyle.container}>
        <SafeAreaView>
          <Appbar.Header>
            <Appbar.Content title={'Transaction'} subtitle={'transcation'} />
            <Appbar.Action
              icon="link"
              onPress={() => this.props.navigation.navigate('')}
            />
          </Appbar.Header>
          <ScrollView style={{}} contentContainerStyle={{}}>
            <View style={HomeStyle.welcomeContainer}>
              {fetched &&
                actions &&
                actions.map((action, i) => (
                  <View key={i} style={{ padding: 10 }}>
                    <View>
                      <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{`${
                        action.action_trace.act.account
                      }::${action.action_trace.act.name}`}</Text>
                      <Text>{moment(action.block_time).fromNow()}</Text>
                    </View>
                    <View>
                      <Text
                        onPress={() =>
                          this.props.navigation.navigate('TransactionDetail', {
                            txId: action.action_trace.trx_id
                          })
                        }
                      >
                        {action.action_trace.trx_id}
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
