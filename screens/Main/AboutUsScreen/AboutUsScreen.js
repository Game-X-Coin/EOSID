import React, { Component } from 'react';
import { View } from 'react-native';
import { Appbar, Text, TouchableRipple, Title } from 'react-native-paper';
import { Icon, WebBrowser } from 'expo';

import { ScrollView, BackgroundView } from '../../../components/View';

import { Theme } from '../../../constants';
import { Logo } from '../../../components/SVG';

const Item = ({ title, onPress }) => (
  <TouchableRipple
    style={{
      padding: 20
    }}
    onPress={onPress}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ flex: 1, marginLeft: 10, fontSize: 15 }}>{title}</Text>
      <Icon.Ionicons
        size={18}
        color={Theme.palette.darkGray}
        name="ios-arrow-forward"
      />
    </View>
  </TouchableRipple>
);

export class AboutUsScreen extends Component {
  openBrowser = link => WebBrowser.openBrowserAsync(link);

  render() {
    const { navigation } = this.props;

    return (
      <BackgroundView>
        <Appbar.Header
          style={{ backgroundColor: Theme.header.backgroundColor }}
        >
          <Appbar.BackAction onPress={() => navigation.goBack(null)} />
          <Appbar.Content title="About Us" />
        </Appbar.Header>

        <ScrollView>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 50
            }}
          >
            <Logo scale="3" />

            <Title style={{ marginTop: 15, ...Theme.h4 }}>GameXCoin</Title>
            <Text style={{ color: Theme.palette.darkGray, ...Theme.text }}>
              The Universal Game Currency
            </Text>
          </View>

          <View
            style={{
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: Theme.palette.gray
            }}
          >
            <Item
              title="Homepage"
              onPress={() => this.openBrowser('https://gamexcoin.io')}
            />
            <Item
              title="Telegram"
              onPress={() => this.openBrowser('https://t.me/GXC_EN')}
            />
            <Item
              title="Github"
              onPress={() => this.openBrowser('https://github.com/game-x-coin')}
            />
            <Item
              title="Privacy Policy"
              onPress={() =>
                this.openBrowser('https://gamexcoin.io/policy/eosid.html')
              }
            />
          </View>
        </ScrollView>
      </BackgroundView>
    );
  }
}
