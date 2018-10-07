import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Appbar, List } from 'react-native-paper';

import HomeStyle from '../../../styles/HomeStyle';

@inject('userStore')
@observer
export class AccountScreen extends Component {
  moveScreen = routeName => this.props.navigation.navigate(routeName);

  render() {
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
            <List.Section>
              <List.Item title="user2" />
            </List.Section>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
