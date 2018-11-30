import React, { Component } from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation';
import { Appbar } from 'react-native-paper';

import { StakeResource } from './StakeResource';
import { UnstakeResource } from './UnstakeResource';

import { Theme } from '../../../constants';
import { ResourceView } from './ResourceView';
import { BackgroundView } from '../../../components/View';

const TopTabNavigator = createMaterialTopTabNavigator(
  {
    Stake: StakeResource,
    Unstake: UnstakeResource
  },
  {
    swipeEnabled: false,
    backBehavior: null,
    tabBarOptions: {
      activeTintColor: 'black',
      inactiveTintColor: 'black',
      style: {
        backgroundColor: Theme.app.backgroundColor
      },
      indicatorStyle: {
        backgroundColor: Theme.palette.primary,
        height: 3
      }
    }
  }
);

class ManageResourceScreen extends Component {
  render() {
    const { navigation } = this.props;
    const { resourceName } = navigation.state.params;

    return (
      <BackgroundView>
        <Appbar.Header
          style={{
            elevation: 0,
            backgroundColor: Theme.header.backgroundColor
          }}
        >
          <Appbar.BackAction onPress={() => navigation.goBack(null)} />
          <Appbar.Content title={`Manage ${resourceName}`} />
        </Appbar.Header>

        <ResourceView type={resourceName} />
        <TopTabNavigator navigation={navigation} />
      </BackgroundView>
    );
  }
}

ManageResourceScreen.router = TopTabNavigator.router;

export { ManageResourceScreen };
