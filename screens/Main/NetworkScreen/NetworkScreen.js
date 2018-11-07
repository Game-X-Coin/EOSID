import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { SafeAreaView, View } from 'react-native';
import { Appbar, List, Button } from 'react-native-paper';

import { ScrollView } from '../../../components/View';

import HomeStyle from '../../../styles/HomeStyle';

@inject('networkStore')
@observer
export class NetworkScreen extends Component {
  moveScreen = routeName => this.props.navigation.navigate(routeName);

  render() {
    const { networkStore, navigation } = this.props;
    const { defaultNetworks, customNetworks } = networkStore;

    return (
      <View style={HomeStyle.container}>
        <SafeAreaView style={HomeStyle.container}>
          <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.goBack(null)} />
            <Appbar.Content title="Networks" />
            <Appbar.Action
              icon="add"
              onPress={() => this.moveScreen('AddNetwork')}
            />
          </Appbar.Header>

          <ScrollView>
            <List.Section title="Mainnet">
              {defaultNetworks.map(({ id, name, url }) => (
                <List.Item key={id} title={name} description={url} />
              ))}
            </List.Section>

            <List.Section title="Custom">
              {customNetworks.map(({ id, name, url }) => (
                <List.Item key={id} title={name} description={url} />
              ))}
              {!customNetworks.length && (
                <List.Item title="No custom networks" />
              )}
            </List.Section>
          </ScrollView>

          <Button
            style={{ padding: 5, margin: 20 }}
            mode="contained"
            onPress={() => this.moveScreen('AddNetwork')}
          >
            Add custom network
          </Button>
        </SafeAreaView>
      </View>
    );
  }
}
