import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Appbar, List, Button } from 'react-native-paper';

import HomeStyle from '../../../styles/HomeStyle';

@inject('networkStore')
@observer
export class NetworkScreen extends Component {
  moveScreen = routeName => this.props.navigation.navigate(routeName);

  render() {
    const { networkStore, navigation } = this.props;
    const { defaultNetworks, userNetworks } = networkStore;

    return (
      <View style={HomeStyle.container}>
        <SafeAreaView style={HomeStyle.container}>
          <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.goBack(null)} />
            <Appbar.Content title={'Network'} />
            <Appbar.Action
              icon="add"
              onPress={() => this.moveScreen('AddNetwork')}
            />
          </Appbar.Header>

          <ScrollView style={HomeStyle.container}>
            <List.Section title="Mainnet">
              {defaultNetworks.map(({ id, name, url }) => (
                <List.Item key={id} title={name} description={url} />
              ))}
            </List.Section>

            <List.Section title="Custom">
              {userNetworks.map(({ id, name, url }) => (
                <List.Item key={id} title={name} description={url} />
              ))}
            </List.Section>

            <Button onPress={() => this.moveScreen('AddNetwork')}>
              Add custom network
            </Button>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
