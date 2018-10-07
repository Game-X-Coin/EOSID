import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Appbar, List, Button } from 'react-native-paper';

import HomeStyle from '../../../styles/HomeStyle';

@inject('networkStore')
@observer
export class NetworkScreen extends Component {
  render() {
    const { networkStore, navigation } = this.props;
    const { defaultNetworks, userNetworks } = networkStore;

    return (
      <View style={HomeStyle.container}>
        <SafeAreaView style={HomeStyle.container}>
          <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.goBack(null)} />
            <Appbar.Content title={'Network'} />
          </Appbar.Header>

          <ScrollView style={HomeStyle.container}>
            <List.Section title="Mainnet">
              {defaultNetworks.map(({ id, name }) => (
                <List.Item key={id} title={name} />
              ))}
            </List.Section>

            <List.Section title="Custom">
              {userNetworks.map(({ id, name }) => (
                <List.Item key={id} title={name} />
              ))}
            </List.Section>

            <Button onPress={() => navigation.push('AddNetwork')}>
              Add custom network
            </Button>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
