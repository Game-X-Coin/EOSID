import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { View, Clipboard } from 'react-native';
import { Appbar, Button, Text, Colors } from 'react-native-paper';
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
        <Appbar.Header
          style={{ backgroundColor: Theme.header.backgroundColor }}
        >
          <Appbar.BackAction onPress={() => navigation.goBack(null)} />
          <Appbar.Content title="Permission" />
        </Appbar.Header>

        <Toast ref={c => (this.toast = c)} />

        <ScrollView>
          <View style={{ height: 20, backgroundColor: Theme.pallete.gray }} />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 15,
              ...Theme.surface
            }}
          >
            <View
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
            >
              <Icon.Ionicons name="md-contact" size={30} />
              <Text
                style={{
                  marginLeft: 20,
                  ...Theme.h5
                }}
              >
                Account
              </Text>
            </View>

            <Text style={Theme.h5}>{name}</Text>
          </View>

          {keys.map(key => {
            const { permission, publicKey } = AccountService.getParsingKey(key);
            const capitalizedPerm =
              permission.charAt(0).toUpperCase() + permission.slice(1);

            return (
              <View
                key={permission}
                style={{ backgroundColor: Theme.pallete.gray }}
              >
                <View style={{ height: 20 }} />

                <View style={Theme.surface}>
                  <Text
                    style={{
                      ...Theme.p,
                      marginTop: 15,
                      marginHorizontal: 20,
                      paddingVertical: 10,
                      fontSize: 13,
                      borderBottomWidth: 1,
                      borderColor: Colors.grey200,
                      color: Colors.grey700
                    }}
                  >
                    {capitalizedPerm} Key
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 15
                    }}
                  >
                    <Text
                      style={{
                        flex: 1,
                        paddingVertical: 20,
                        marginRight: 30,
                        ...Theme.p
                      }}
                    >
                      {publicKey}
                    </Text>
                    <Button
                      mode="contained"
                      onPress={() => this.copy(publicKey)}
                    >
                      copy
                    </Button>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </BackgroundView>
    );
  }
}
