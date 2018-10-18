import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Appbar, TouchableRipple, Text, Caption } from 'react-native-paper';
import moment from 'moment';

import HomeStyle from '../styles/HomeStyle';

@inject('accountStore')
@observer
export default class TransactionScreen extends Component {
  render() {
    const { actions } = this.props.accountStore;

    return (
      <View style={HomeStyle.container}>
        <SafeAreaView style={HomeStyle.container}>
          <Appbar.Header>
            <Appbar.Content title="Transaction" />
          </Appbar.Header>
          <ScrollView style={HomeStyle.container}>
            {actions.map(({ block_time, action_trace }, i) => (
              <TouchableRipple
                key={i}
                style={{
                  padding: 15,
                  borderBottomColor: '#fafafa',
                  borderBottomWidth: 1
                }}
                onPress={() =>
                  this.props.navigation.navigate('TransactionDetail', {
                    txId: action_trace.trx_id
                  })
                }
              >
                <View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 17 }}>
                      {`${action_trace.act.account}::${action_trace.act.name} `}
                    </Text>
                    <Caption>({moment(block_time).fromNow()})</Caption>
                  </View>
                  <View>
                    <Text>{action_trace.trx_id}</Text>
                  </View>
                </View>
              </TouchableRipple>
            ))}
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
