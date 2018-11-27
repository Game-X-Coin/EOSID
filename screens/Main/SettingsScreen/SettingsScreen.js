import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { View } from 'react-native';
import { Appbar, Text, TouchableRipple, Colors } from 'react-native-paper';
import { Icon } from 'expo';

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

const Item = ({ title, description, onPress, children }) => (
  <TouchableRipple
    style={{
      padding: 20
    }}
    onPress={onPress}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ flex: 1, marginLeft: 10, fontSize: 15 }}>{title}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {description && (
          <Text style={{ marginRight: 15, color: Colors.grey600 }}>
            {description}
          </Text>
        )}

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
              description={currentAccount && currentAccount.name}
              onPress={() => this.moveScreen('Accounts')}
            />
            {settings.accountPincodeEnabled && (
              <Item
                title="Account Pincode"
                onPress={() => this.moveScreen('SettingsAccountPin')}
              />
            )}
          </Section>
          <Section title="App Settings">
            <Item
              title="Networks"
              onPress={() => this.moveScreen('SettingsNetwork')}
            />
            {/* <Item title="Language" /> */}
            <Item
              title="App Pincode"
              onPress={() => this.moveScreen('SettingsAppPin')}
            />
          </Section>
          <Section title="App Info">
            <Item title="Support" />
          </Section>
        </ScrollView>
      </BackgroundView>
    );
  }
}
