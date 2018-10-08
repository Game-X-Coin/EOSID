import React, { Component } from 'react';
import { View, SafeAreaView } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import { Button, Text } from 'react-native-paper';
import { Logo } from '../../../components/SVG';

@inject('userStore')
@observer
export class WelcomeScreen extends Component {
  moveScreen = routeName => this.props.navigation.navigate(routeName);

  render() {
    const { users } = this.props.userStore;

    const BeforeSignUp = () => (
      <View>
        <Text>EOSID, identification for EOS</Text>
        <Button mode="contained" onPress={() => this.moveScreen('SignUp')}>
          Start EOSID
        </Button>
      </View>
    );

    const SelectUser = () => (
      <View>
        <Text>Sign in as</Text>
        {users.map(({ id, username }) => (
          <Button
            key={id}
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
          <Text style={{ marginTop: 10, fontSize: 35, fontWeight: 'bold' }}>
            EOSID
          </Text>
        </View>

        <View>{users.length ? <SelectUser /> : <BeforeSignUp />}</View>
      </SafeAreaView>
    );
  }
}
