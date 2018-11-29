import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { View } from 'react-native';
import { Button, Text, Appbar } from 'react-native-paper';
import { AndroidBackHandler } from 'react-navigation-backhandler';

import { Theme, DarkTheme } from '../../../constants';
import { BackgroundView } from '../../../components/View';
import { MemoIcon, AccountIcon, WalletIcon } from '../../../components/SVG';

@inject('accountStore')
@observer
export class TransferResultScreen extends Component {
  moveToActivity = () => {
    this.props.navigation.navigate('Activity');
  };

  onBackPress = () => {
    this.moveToActivity();
    return true;
  };

  render() {
    const { navigation, accountStore } = this.props;
    const { amount, symbol, receiver, memo } = navigation.state.params || {};

    const balance = symbol && accountStore.tokens[symbol].amount;

    const Item = ({ title, description, icon }) => (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
          padding: 20,
          ...DarkTheme.surface
        }}
      >
        {icon}

        <View style={{ flex: 1 }}>
          <Text
            style={{
              marginBottom: 2,
              ...DarkTheme.p,
              color: Theme.palette.info
            }}
          >
            {title}
          </Text>
          <Text style={DarkTheme.p}>{description}</Text>
        </View>
      </View>
    );

    return (
      <AndroidBackHandler onBackPress={this.onBackPress}>
        <BackgroundView dark>
          <Appbar.Header
            dark
            style={{ backgroundColor: DarkTheme.header.backgroundColor }}
          >
            <Appbar.Content title="Transfer Result" />
          </Appbar.Header>

          <View
            style={{
              flex: 1,
              margin: Theme.innerSpacing,
              paddingTop: 50
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  marginBottom: 7,
                  ...Theme.h5,
                  color: Theme.palette.info
                }}
              >
                Transferred amount
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text style={{ marginRight: 7, ...DarkTheme.h1 }}>
                  {amount}
                </Text>
                <Text
                  style={{
                    lineHeight: DarkTheme.h1.fontSize,
                    ...DarkTheme.h4
                  }}
                >
                  {symbol}
                </Text>
              </View>
            </View>

            <Item
              title="Receiver"
              description={receiver}
              icon={
                <AccountIcon
                  scale={1.5}
                  color={Theme.palette.inActive}
                  style={{ marginRight: 15 }}
                />
              }
            />

            {(memo || '') !== '' && (
              <Item
                title="Memo"
                description={memo || ''}
                icon={
                  <MemoIcon
                    scale={1.5}
                    color={Theme.palette.inActive}
                    style={{ marginRight: 15 }}
                  />
                }
              />
            )}

            <Item
              title="Remaining Amount"
              description={`${balance} ${symbol}`}
              icon={
                <WalletIcon
                  scale={1.5}
                  color={Theme.palette.inActive}
                  style={{ marginRight: 15 }}
                />
              }
            />

            <Button
              mode="contained"
              color="#fff"
              onPress={this.moveToActivity}
              style={{ padding: 5, marginTop: 15 }}
            >
              Close
            </Button>
          </View>
        </BackgroundView>
      </AndroidBackHandler>
    );
  }
}
