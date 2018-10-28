import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import {
  Appbar,
  Caption,
  Text,
  TouchableRipple,
  Colors,
  Button
} from 'react-native-paper';
import { Icon } from 'expo';

import HomeStyle from '../../../styles/HomeStyle';

const Section = ({ title, children }) => (
  <View>
    <Caption
      style={{
        marginVertical: 0,
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: Colors.grey200
      }}
    >
      {title}
    </Caption>
    {children}
  </View>
);

const Item = ({ title, description, onPress }) => (
  <TouchableRipple
    style={{ padding: 15, borderBottomWidth: 1, borderColor: Colors.grey200 }}
    onPress={onPress}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ flex: 1 }}>{title}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {description && (
          <Text style={{ marginRight: 20, color: Colors.grey700 }}>
            {description}
          </Text>
        )}

        <Icon.Ionicons
          size={18}
          color={Colors.grey700}
          name="ios-arrow-forward"
        />
      </View>
    </View>
  </TouchableRipple>
);

@inject('userStore', 'accountStore', 'networkStore')
@observer
export class SettingsScreen extends Component {
  moveScreen = routeName => this.props.navigation.navigate(routeName);

  signOut = () => {
    this.props.userStore.signOut();
    this.moveScreen('Auth');
  };

  render() {
    const { currentUserAccount } = this.props.accountStore;

    return (
      <View style={HomeStyle.container}>
        <SafeAreaView style={HomeStyle.container}>
          <Appbar.Header>
            <Appbar.Content title={'Settings'} />
          </Appbar.Header>
          <ScrollView style={HomeStyle.container}>
            <Section title="User Settings">
              <Item
                title="Accounts"
                description={currentUserAccount && currentUserAccount.name}
                onPress={() => this.moveScreen('Accounts')}
              />
            </Section>
            <Section title="App Settings">
              <Item
                title="Networks"
                onPress={() => this.moveScreen('SettingsNetwork')}
              />
              <Item title="Language" />
            </Section>
            <Section title="App Info">
              <Item title="Support" />
            </Section>

            <Button
              style={{ padding: 5, marginTop: 15 }}
              color={Colors.red500}
              onPress={this.signOut}
            >
              Sign out
            </Button>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
