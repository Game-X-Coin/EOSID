import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Appbar, List } from 'react-native-paper';

import HomeStyle from '../../../styles/HomeStyle';

@inject('userStore')
@observer
export class SettingsScreen extends Component {
  moveScreen = routeName => this.props.navigation.navigate(routeName);

  signOut = () => {
    this.props.userStore.signOut();
    this.moveScreen('Auth');
  };

  render() {
    return (
      <View style={HomeStyle.container}>
        <SafeAreaView style={HomeStyle.container}>
          <Appbar.Header>
            <Appbar.Content title={'Settings'} />
            <Appbar.Action icon="lock" onPress={this.signOut} />
          </Appbar.Header>
          <ScrollView style={HomeStyle.container}>
            <List.Section>
              <List.Item
                title="Network"
                left={() => <List.Icon icon="dns" />}
                onPress={() => this.moveScreen('SettingsNetwork')}
              />
              <List.Item
                title="Language"
                left={() => <List.Icon icon="translate" />}
                onPress={() => this.moveScreen('language')}
              />
            </List.Section>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
