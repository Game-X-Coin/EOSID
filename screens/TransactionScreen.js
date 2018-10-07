import React, { Component } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Appbar, List } from 'react-native-paper';

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
                actions && (
                  <List.Section>
                    {actions.map((action, i) => (
                      <List.Item
                        key={i}
                        title={`${action.action_trace.act.name}::${
                          action.action_trace.act.name
                        }`}
                        description={action.action_trace.trx_id}
                      />
                    ))}
                  </List.Section>
                )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
