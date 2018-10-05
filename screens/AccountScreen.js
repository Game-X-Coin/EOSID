import React, { Component } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Appbar, List } from 'react-native-paper';

import HomeStyle from '../styles/HomeStyle';

export default class AccountScreen extends Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <View style={HomeStyle.container}>
        <SafeAreaView>
          <Appbar.Header>
            <Appbar.Content title={'Account'} subtitle={'account'} />
            <Appbar.Action
              icon="add"
              onPress={() => this.props.navigation.push('AddAccount')}
            />
          </Appbar.Header>
          <ScrollView style={HomeStyle.container} contentContainerStyle={{}} />
          <View style={HomeStyle.welcomeContainer}>
            <List.Section>
              <List.Item title="user1" />
              <List.Item title="user2" />
            </List.Section>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
