import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Appbar, Text, Caption, List } from 'react-native-paper';
import moment from 'moment';

import HomeStyle from '../../../styles/HomeStyle';

@inject('accountStore')
@observer
export class TransactionScreen extends Component {
  render() {
    const { actions } = this.props.accountStore;

    return (
      <View style={HomeStyle.container}>
        <SafeAreaView style={HomeStyle.container}>
          <Appbar.Header>
            <Appbar.Content title="Transaction" />
          </Appbar.Header>
          <ScrollView style={HomeStyle.container}>
            <List.Section title="Lastest">
              {actions.map(({ block_time, action_trace }, i) => (
                <List.Item
                  key={i}
                  title={
                    <Text>
                      {action_trace.act.name}{' '}
                      <Caption>by {action_trace.act.account}</Caption>
                    </Text>
                  }
                  // description={JSON.stringify(action_trace.act.data)}
                  right={() => (
                    <Caption style={{ alignSelf: 'center' }}>
                      {moment(block_time).fromNow()}
                    </Caption>
                  )}
                  onPress={() =>
                    this.props.navigation.navigate('TransactionDetail', {
                      txId: action_trace.trx_id
                    })
                  }
                />
              ))}
            </List.Section>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
