import React, { Component } from 'react';
import { View } from 'react-native';
import { Icon } from 'expo';
import { Appbar, Text, TouchableRipple } from 'react-native-paper';

import { ScrollView, BackgroundView } from '../../../components/View';

import { Theme } from '../../../constants';

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
  moveScreen = routeName => this.props.navigation.navigate(routeName);

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
          <Item title="Homepage" onPress={this.changeAppPincode} />
          <Item title="Telegram" onPress={this.changeAppPincode} />
          <Item title="Github" onPress={this.changeAppPincode} />
        </ScrollView>
      </BackgroundView>
    );
  }
}
