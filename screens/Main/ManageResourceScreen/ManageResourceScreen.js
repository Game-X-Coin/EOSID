import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation';
import { Appbar } from 'react-native-paper';

import { StakeResource } from './StakeResource';
import { UnstakeResource } from './UnstakeResource';

import { Theme } from '../../../constants';
import HomeStyle from '../../../styles/HomeStyle';

const TopTabNavigator = createMaterialTopTabNavigator(
  {
    Stake: StakeResource,
    Unstake: UnstakeResource
  },
  {
    swipeEnabled: false,
    tabBarOptions: { style: { backgroundColor: Theme.primary } }
  }
);

class ManageResourceScreen extends Component {
  render() {
    const { navigation } = this.props;

    return (
      <View style={HomeStyle.container}>
        <SafeAreaView style={HomeStyle.container}>
          <Appbar.Header style={{ elevation: 0 }}>
            <Appbar.BackAction onPress={() => navigation.goBack(null)} />
            <Appbar.Content title="Manage Resource" />
          </Appbar.Header>
          <TopTabNavigator navigation={navigation} />
        </SafeAreaView>
      </View>
    );
  }
}

ManageResourceScreen.router = TopTabNavigator.router;

export { ManageResourceScreen };
