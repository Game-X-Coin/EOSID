import React, { Component } from 'react';
import { View, SafeAreaView } from 'react-native';
import { Button, Text, Title } from 'react-native-paper';
import { Logo } from '../../../components/SVG';

export class WelcomeScreen extends Component {
  moveScreen = routeName => this.props.navigation.navigate(routeName);

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Logo width={3} height={3} />
          <Title style={{ marginTop: 25, fontSize: 27 }}>
            Welcome to EOSID
          </Title>
        </View>

        <View
          style={{
            margin: 30
          }}
        >
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
      </SafeAreaView>
    );
  }
}
