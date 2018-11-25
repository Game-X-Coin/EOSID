import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Appbar, List, Button, Text } from 'react-native-paper';

import { ScrollView, BackgroundView } from '../../../components/View';
import { Theme } from '../../../constants';

@inject('networkStore')
@observer
export class NetworkScreen extends Component {
  moveScreen = routeName => this.props.navigation.navigate(routeName);

  render() {
    const { networkStore, navigation } = this.props;
    const { defaultNetworks, customNetworks } = networkStore;

    return (
      <BackgroundView>
        <Appbar.Header
          style={{ backgroundColor: Theme.header.backgroundColor }}
        >
          <Appbar.BackAction onPress={() => navigation.goBack(null)} />
          <Appbar.Content title="Networks" />
        </Appbar.Header>

        <ScrollView>
          <List.Section title="Mainnet">
            {defaultNetworks.map(
              ({ id, name, chainURL, responseTime, success }) => (
                <List.Item
                  key={id}
                  title={name}
                  description={`${chainURL}`}
                  right={props => (
                    <Text {...props}>
                      {responseTime && responseTime !== 9999
                        ? `${responseTime} ms`
                        : 'delayed'}{' '}
                      {success ? 'alive' : 'disalive'}
                    </Text>
                  )}
                  style={
                    networkStore.currentNetwork.id === id
                      ? { backgroundColor: Theme.primary }
                      : {}
                  }
                />
              )
            )}
          </List.Section>
          <List.Section title="Custom">
            {customNetworks.map(
              ({ id, name, chainURL, responseTime, success }) => (
                <List.Item
                  key={id}
                  title={name}
                  description={`${chainURL}`}
                  right={props => (
                    <Text {...props}>
                      {responseTime && responseTime !== 9999
                        ? `${responseTime} ms`
                        : 'delayed'}{' '}
                      {success ? 'alive' : 'disalive'}
                    </Text>
                  )}
                  style={
                    networkStore.currentNetwork.id === id
                      ? { backgroundColor: Theme.primary }
                      : {}
                  }
                />
              )
            )}
            {!customNetworks.length && <List.Item title="No custom networks" />}
          </List.Section>
        </ScrollView>

        <Button
          style={{ padding: 5, margin: 20 }}
          mode="contained"
          onPress={() => this.moveScreen('AddNetwork')}
        >
          Add custom network
        </Button>
      </BackgroundView>
    );
  }
}
