import React, { Component } from 'react';
import { View, SafeAreaView } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import { Button, Text, Title } from 'react-native-paper';
import { Logo } from '../../../components/SVG';

@inject('userStore')
@observer
export class WelcomeScreen extends Component {
  moveScreen = routeName => this.props.navigation.navigate(routeName);

  render() {
    const { users } = this.props.userStore;

    const BeforeSignUp = () => (
      <View>
        <Text style={{ textAlign: 'center', marginBottom: 8 }}>
          EOSID, identification for EOS
        </Text>
        <Button
          style={{ padding: 5 }}
          mode="contained"
          onPress={() => this.moveScreen('SignUp')}
        >
          Start EOSID
        </Button>
      </View>
    );

    const SelectUser = () => (
      <View>
        <Text style={{ textAlign: 'center' }}>Welcome back!</Text>
        {users.map(({ id, username }) => (
          <Button
            key={id}
            style={{ padding: 5, marginTop: 8 }}
            mode="contained"
            onPress={() => this.moveScreen('SignIn')}
          >
            {username}
          </Button>
        ))}
      </View>
    );

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Logo width={3.5} height={3.5} />
          <Title style={{ marginTop: 20, fontSize: 30 }}>
            Welcome to EOSID
          </Title>
        </View>

        <View
          style={{
            margin: 20
          }}
        >
          {users.length ? <SelectUser /> : <BeforeSignUp />}
        </View>
      </SafeAreaView>
    );
  }
}
