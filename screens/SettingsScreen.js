import React, { Component } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Appbar, List } from 'react-native-paper';

import HomeStyle from '../styles/HomeStyle';

export default class SettingsScreen extends Component {
  render() {
    return (
      <View style={HomeStyle.container}>
        <SafeAreaView style={HomeStyle.container}>
          <Appbar.Header>
            <Appbar.Content title={'Settings'} subtitle={'settings'} />
            <Appbar.Action icon="lock" onPress={this.signOut} />
          </Appbar.Header>
          <ScrollView style={HomeStyle.container} contentContainerStyle={{}}>
            <List.Section>
              <List.Item
                title="Network"
                left={() => <List.Icon icon="dns" />}
                onPress={() => this.move('network')}
              />
              <List.Item
                title="Language"
                left={() => <List.Icon icon="translate" />}
                onPress={() => this.move('language')}
              />
            </List.Section>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
