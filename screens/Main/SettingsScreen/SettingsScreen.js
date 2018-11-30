import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { View, Image } from 'react-native';
import { Appbar, Text, TouchableRipple, Colors } from 'react-native-paper';

import { Theme } from '../../../constants';
import { ScrollView, BackgroundView } from '../../../components/View';

const Section = ({ title, children }) => (
  <View>
    <View
      style={{
        backgroundColor: Theme.palette.gray,
        height: 20
      }}
    />
    <View style={{ backgroundColor: Theme.surface.backgroundColor }}>
      <Text
        style={{
          marginTop: 15,
          marginHorizontal: 20,
          paddingVertical: 10,
          fontSize: 13,
          borderBottomWidth: 1,
          borderColor: Colors.grey200,
          color: Colors.grey700
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  </View>
);

const Item = ({ title, description, onPress, icon }) => (
  <TouchableRipple
    style={{
      padding: 20,
      backgroundColor: Theme.surface.backgroundColor
    }}
    onPress={onPress}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Image
        resizeMode="contain"
        source={icon}
        style={{ width: 20, height: 20, marginRight: 5 }}
      />
      <Text style={{ flex: 1, marginLeft: 10, fontSize: 15 }}>{title}</Text>
      {description && (
        <Text style={{ color: Theme.palette.darkGray }}>{description}</Text>
      )}
    </View>
  </TouchableRipple>
);

@inject('accountStore', 'settingsStore')
@observer
export class SettingsScreen extends Component {
  moveScreen = routeName => this.props.navigation.navigate(routeName);

  render() {
    const { currentAccount } = this.props.accountStore;
    const { settings } = this.props.settingsStore;

    return (
      <BackgroundView>
        <Appbar.Header
          style={{ backgroundColor: Theme.header.backgroundColor }}
        >
          <Appbar.Content title="Settings" />
        </Appbar.Header>
        <ScrollView style={{ paddingBottom: 50 }}>
          <Section title="User Settings">
            <Item
              title="Accounts"
              icon={require('../../../assets/icons/account_outline.png')}
              description={currentAccount && currentAccount.name}
              onPress={() => this.moveScreen('Accounts')}
            />
            {settings.accountPincodeEnabled && (
              <Item
                title="Account Pincode"
                icon={require('../../../assets/icons/pincode_outline.png')}
                onPress={() => this.moveScreen('SettingsAccountPin')}
              />
            )}
          </Section>
          <Section title="App Settings">
            <Item
              title="Networks"
              icon={require('../../../assets/icons/networks_outline.png')}
              onPress={() => this.moveScreen('SettingsNetwork')}
            />
            {/* <Item title="Language" /> */}
            <Item
              title="App Pincode"
              icon={require('../../../assets/icons/pincode_outline.png')}
              onPress={() => this.moveScreen('SettingsAppPin')}
            />
          </Section>
          <Section title="App Info">
            <Item
              title="About Us"
              icon={require('../../../assets/icons/aboutus_outline.png')}
              onPress={() => this.moveScreen('SettingsAboutUs')}
            />
          </Section>
        </ScrollView>
      </BackgroundView>
    );
  }
}
