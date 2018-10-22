import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { SafeAreaView, View } from 'react-native';
import { Appbar } from 'react-native-paper';

import { StakeResource } from './StakeResource';
import { UnstakeResource } from './UnstakeResource';

import HomeStyle from '../../../styles/HomeStyle';

@inject('accountStore')
@observer
export class ManageResourceScreen extends Component {
  @observable
  isStaking = true;

  // change mode to stake or unstake
  changeResourceMode = bools => {
    this.isStaking = bools;
  };

  moveScreen = routeName => this.props.navigation.navigate(routeName);

  render() {
    return (
      <View style={HomeStyle.container}>
        <SafeAreaView style={HomeStyle.container}>
          <Appbar.Header>
            <Appbar.BackAction
              onPress={() => this.props.navigation.goBack(null)}
            />
            <Appbar.Content title="Manage Resource" />
          </Appbar.Header>
          <View style={HomeStyle.container}>
            {this.isStaking ? (
              <StakeResource
                changeResourceMode={this.changeResourceMode}
                navigation={this.props.navigation}
              />
            ) : (
              <UnstakeResource
                changeResourceMode={this.changeResourceMode}
                navigation={this.props.navigation}
              />
            )}
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
