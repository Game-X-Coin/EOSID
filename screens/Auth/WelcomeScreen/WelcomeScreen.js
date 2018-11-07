import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { View, SafeAreaView } from 'react-native';
import { Button, Text, Title } from 'react-native-paper';
import { Logo } from '../../../components/SVG';

@inject('settingsStore')
@observer
export class WelcomeScreen extends Component {
  componentDidMount() {
    const { navigation, settingsStore } = this.props;

    // app pincode is enabled
    if (settingsStore.settings.appPincodeEnabled) {
      navigation.navigate('ConfirmAppPin', {
        cantBack: true,
        cb: () => {
          navigation.navigate('Account');
        }
      });
      // app already initialized
    } else if (settingsStore.initialized) {
      navigation.navigate('Account');
    }
  }

  async start() {
    const { navigation, settingsStore } = this.props;

    await settingsStore.initializeSettings();
    navigation.navigate('ImportAccount', { isSignUp: true });
  }

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
            onPress={() => this.start()}
          >
            Start EOSID
          </Button>
        </View>
      </SafeAreaView>
    );
  }
}
