import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { View } from 'react-native';
import { Appbar, Text, TouchableRipple, Colors } from 'react-native-paper';
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

@inject('accountStore')
@observer
export class SettingsAccountPinScreen extends Component {
  changeAccountPincode = () => {
    const { navigation } = this.props;

    navigation.navigate('ConfirmPin', {
      pinProps: {
        description: 'Confirm password before change.'
      },
      cb: async () => {
        navigation.navigate('NewPin', {
          pinProps: {
            description: 'Set password what you want to change.'
          },
          cb: async () => {
            navigation.navigate('Account');
          }
        });
      }
    });
  };

  moveScreen = routeName => this.props.navigation.navigate(routeName);

  render() {
    const { navigation } = this.props;

    return (
      <BackgroundView>
        <Appbar.Header style={{ backgroundColor: Theme.headerBackgroundColor }}>
          <Appbar.BackAction onPress={() => navigation.goBack(null)} />
          <Appbar.Content title="Account Pincode" />
        </Appbar.Header>
        <ScrollView>
          <Item title="Change Pincode" onPress={this.changeAccountPincode} />
        </ScrollView>
      </BackgroundView>
    );
  }
}
