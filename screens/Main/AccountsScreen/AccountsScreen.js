import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { View } from 'react-native';
import { Appbar, List, Button, RadioButton } from 'react-native-paper';

import { ScrollView } from '../../../components/View';

import HomeStyle from '../../../styles/HomeStyle';

@inject('accountStore', 'networkStore')
@observer
export class AccountsScreen extends Component {
  moveScreen = routeName => this.props.navigation.navigate(routeName);

  changeAccount = accoundId => {
    this.props.accountStore.changeCurrentAccount(accoundId);
    this.moveScreen('Account');
  };

  render() {
    const { accountStore, networkStore, navigation } = this.props;
    const { accounts, currentAccount } = accountStore;
    const { allNetworks } = networkStore;

    return (
      <View style={HomeStyle.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack(null)} />
          <Appbar.Content title="Accounts" />
          <Appbar.Action
            icon="add"
            onPress={() => this.moveScreen('ImportAccount')}
          />
        </Appbar.Header>

        <ScrollView>
          <List.Section title="Select to change account">
            {accounts.map(({ id, name, networkId }) => (
              <List.Item
                key={id}
                title={name}
                description={
                  allNetworks.find(({ id }) => id === networkId).name
                }
                right={() => (
                  <RadioButton
                    status={
                      name === (currentAccount && currentAccount.name)
                        ? 'checked'
                        : 'unchecked'
                    }
                  />
                )}
                onPress={() => this.changeAccount(id)}
              />
            ))}
          </List.Section>
        </ScrollView>

        <Button
          style={{ margin: 20, padding: 5 }}
          mode="contained"
          onPress={() => this.moveScreen('ImportAccount')}
        >
          Import account
        </Button>
      </View>
    );
  }
}
