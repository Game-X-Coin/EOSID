import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { SafeAreaView } from 'react-native';
import { Appbar, List, Text } from 'react-native-paper';

import { ScrollView, BackgroundView } from '../../../components/View';
import { Theme } from '../../../constants';

@inject('accountStore', 'networkStore')
@observer
export class NetworkScreen extends Component {
  moveScreen = routeName => this.props.navigation.navigate(routeName);

  changeNetwork = async (chainId, networkId) => {
    const { accountStore, networkStore } = this.props;
    networkStore.changeNetwork(chainId, networkId);
    accountStore.getAccounts();
  };

  render() {
    const { networkStore, navigation } = this.props;
    const { chains } = networkStore;

    return (
      <BackgroundView>
        <Appbar.Header
          style={{ backgroundColor: Theme.header.backgroundColor }}
        >
          <Appbar.BackAction onPress={() => navigation.goBack(null)} />
          <Appbar.Content title="Networks" />
        </Appbar.Header>

        <ScrollView>
          <SafeAreaView>
            {Object.keys(chains).map(key => (
              <List.Section title={chains[key].name} key={key}>
                {chains[key].nodes &&
                  chains[key].nodes.length &&
                  chains[key].nodes.map(
                    ({ id, name, chainURL, responseTime, success }) => (
                      <List.Item
                        key={id}
                        title={name}
                        description={`${chainURL}`}
                        right={() => (
                          <Text
                            style={{
                              alignSelf: 'center',
                              paddingRight: 5,
                              color: Theme.palette.primary
                            }}
                          >
                            {responseTime ? `${responseTime} ms` : ''}
                            {success ? '' : 'no response'}
                          </Text>
                        )}
                        style={
                          networkStore.currentNetwork.id === id
                            ? { backgroundColor: Theme.palette.inActive }
                            : {}
                        }
                        disabled={networkStore.currentNetwork.id === id}
                        onPress={() => this.changeNetwork(key, id)}
                      />
                    )
                  )}
                {(!chains[key].nodes || !chains[key].nodes.length) && (
                  <List.Item title="No networks" />
                )}
              </List.Section>
            ))}
          </SafeAreaView>
        </ScrollView>

        {/* <Button
          style={{ padding: 5, margin: 20 }}
          mode="contained"
          onPress={() => this.moveScreen('AddNetwork')}
        >
          Add network
        </Button> */}
      </BackgroundView>
    );
  }
}
