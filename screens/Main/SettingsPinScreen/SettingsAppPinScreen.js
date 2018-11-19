import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { View } from 'react-native';
import {
  Appbar,
  Text,
  TouchableRipple,
  Switch,
  Colors
} from 'react-native-paper';
import { Icon } from 'expo';

import { Theme } from '../../../constants';
import { ScrollView, BackgroundView } from '../../../components/View';

const Item = ({ title, onPress, children }) => (
  <TouchableRipple
    style={{
      padding: 20
    }}
    onPress={onPress}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ flex: 1, marginLeft: 10, fontSize: 15 }}>{title}</Text>
      {children ? (
        children
      ) : (
        <Icon.Ionicons
          size={18}
          color={Colors.grey600}
          name="ios-arrow-forward"
        />
      )}
    </View>
  </TouchableRipple>
);

@inject('accountStore', 'settingsStore')
@observer
export class SettingsAppPinScreen extends Component {
  @observable
  appPincodeEnabled = this.props.settingsStore.settings.appPincodeEnabled;

  toggleAppPincode = () => {
    const { settingsStore, navigation } = this.props;

    this.appPincodeEnabled = !this.appPincodeEnabled;

    // tricky - when navigate back to settings
    setTimeout(() => {
      this.appPincodeEnabled = !this.appPincodeEnabled;
    }, 1000);

    // check app pincode is enabled
    if (settingsStore.settings.appPincodeEnabled) {
      navigation.navigate('ConfirmAppPin', {
        cb: async () => {
          await settingsStore.updateSettings({ appPincodeEnabled: false });
          this.appPincodeEnabled = false;
        }
      });
    } else {
      navigation.navigate('NewAppPin', {
        cb: () => {
          this.appPincodeEnabled = true;
        }
      });
    }
  };

  changeAppPincode = () => {
    const { navigation } = this.props;

    navigation.navigate('ConfirmAppPin', {
      pinProps: {
        description: 'Confirm password before change.'
      },
      cb: async () => {
        navigation.navigate('NewAppPin', {
          pinProps: {
            description: 'Set password what you want to change.'
          }
        });
      }
    });
  };

  moveScreen = routeName => this.props.navigation.navigate(routeName);

  render() {
    const {
      navigation,
      settingsStore: { settings }
    } = this.props;

    return (
      <BackgroundView>
        <Appbar.Header style={{ backgroundColor: Theme.headerBackgroundColor }}>
          <Appbar.BackAction onPress={() => navigation.goBack(null)} />
          <Appbar.Content title="App Pincode" />
        </Appbar.Header>
        <ScrollView>
          <Item
            title={
              !settings.appPincodeEnabled ? 'Enable Pincode' : 'Disable Pincode'
            }
            onPress={this.toggleAppPincode}
          >
            <Switch
              value={this.appPincodeEnabled}
              onValueChange={this.toggleAppPincode}
            />
          </Item>

          {settings.appPincodeEnabled && (
            <Item title="Change Pincode" onPress={this.changeAppPincode} />
          )}
        </ScrollView>
      </BackgroundView>
    );
  }
}
