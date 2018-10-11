import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Appbar, List, Button, RadioButton } from 'react-native-paper';

import HomeStyle from '../../../styles/HomeStyle';

@inject('accountStore')
@observer
export class AccountsScreen extends Component {
  moveScreen = routeName => this.props.navigation.navigate(routeName);

  changeUserAccount = accoundId =>
    this.props.accountStore.changeUserAccount(accoundId);

  render() {
    const { accountStore, navigation } = this.props;
    const { userAccounts, currentUserAccount } = accountStore;

    return (
      <View style={HomeStyle.container}>
        <SafeAreaView style={HomeStyle.container}>
          <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.goBack(null)} />
            <Appbar.Content title={'Manage eos account'} />
            <Appbar.Action
              icon="add"
              onPress={() => this.moveScreen('AddAccount')}
            />
          </Appbar.Header>

          <ScrollView style={HomeStyle.container}>
            <List.Section title="Select to change account">
              {userAccounts.map(({ id, name, publicKey }) => (
                <List.Item
                  key={id}
                  title={name}
                  description={publicKey}
                  right={() => (
                    <RadioButton
                      status={
                        name === (currentUserAccount && currentUserAccount.name)
                          ? 'checked'
                          : 'unchecked'
                      }
                      onPress={() => this.changeUserAccount(id)}
                    />
                  )}
                  onPress={() => this.changeUserAccount(id)}
                />
              ))}
            </List.Section>

            <Button onPress={() => this.moveScreen('AddAccount')}>
              Add account
            </Button>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
