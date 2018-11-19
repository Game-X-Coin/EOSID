import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { View, Clipboard } from 'react-native';
import { Appbar, Button, Text } from 'react-native-paper';
import { Icon } from 'expo';
import Toast from '@rimiti/react-native-toastify';

import { Theme } from '../../../constants';
import { AccountService } from '../../../services';

import { BackgroundView, ScrollView } from '../../../components/View';

@inject('accountStore')
@observer
export class PermissionScreen extends Component {
  copy = async str => {
    await Clipboard.setString(str);
    this.toast.show('Copied!');
  };

  moveScreen = routeName => this.props.navigation.navigate(routeName);

  render() {
    const {
      accountStore: {
        currentAccount: { name = '', keys = [] }
      },
      navigation
    } = this.props;

    return (
      <BackgroundView>
        <Appbar.Header style={{ backgroundColor: Theme.headerBackgroundColor }}>
          <Appbar.BackAction onPress={() => navigation.goBack(null)} />
          <Appbar.Content title="Permission" />
        </Appbar.Header>

        <Toast ref={c => (this.toast = c)} />

        <ScrollView>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              margin: Theme.innerSpacing,
              marginBottom: 25,
              padding: 15,
              backgroundColor: Theme.mainBackgroundColor,
              borderRadius: Theme.innerBorderRadius,
              ...Theme.shadow
            }}
          >
            <View
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
            >
              <Icon.Ionicons size={30} name="md-contact" />
              <Text style={{ marginLeft: 10, fontSize: 17 }}>Account</Text>
            </View>

            <Text style={{ fontSize: 17 }}>{name}</Text>
          </View>

          {keys.map(key => {
            const { permission, publicKey } = AccountService.getParsingKey(key);
            const capitalizedPerm =
              permission.charAt(0).toUpperCase() + permission.slice(1);

            return (
              <View
                key={permission}
                style={{
                  marginHorizontal: Theme.innerSpacing,
                  marginBottom: 25
                }}
              >
                <View style={{ marginBottom: 15 }}>
                  <Text style={{ fontSize: 15 }}>{capitalizedPerm} Key</Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: Theme.mainBackgroundColor,
                    borderRadius: Theme.innerBorderRadius,
                    ...Theme.shadow
                  }}
                >
                  <Text
                    style={{
                      flex: 1,
                      alignSelf: 'center',
                      padding: 15,
                      fontSize: 15,
                      fontFamily: 'monospace'
                    }}
                  >
                    {publicKey}
                  </Text>
                  <View style={{ width: 1, backgroundColor: '#d0d0d0' }} />
                  <Button
                    style={{ paddingVertical: 20, fontSize: 17 }}
                    onPress={() => this.copy(publicKey)}
                  >
                    copy
                  </Button>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </BackgroundView>
    );
  }
}
