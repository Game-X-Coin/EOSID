import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { View } from 'react-native';
import { Button, Text, Appbar } from 'react-native-paper';
import { AndroidBackHandler } from 'react-navigation-backhandler';

import { Theme, DarkTheme } from '../../../constants';
import { BackgroundView } from '../../../components/View';

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

    const balance = symbol && accountStore.tokens[symbol];

    const SubItem = ({ title, description }) => (
      <View style={{ marginBottom: Theme.innerSpacing }}>
        <Text
          style={{
            marginBottom: 7,
            fontSize: 17,
            color: Theme.palette.quaternary
          }}
        >
          {title}
        </Text>
        <Text style={DarkTheme.h5}>{description}</Text>
      </View>
    );

    return (
      <AndroidBackHandler onBackPress={this.onBackPress}>
        <BackgroundView dark>
          <Appbar.Header
            style={{ backgroundColor: DarkTheme.header.backgroundColor }}
            dark
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
                  fontSize: 20,
                  color: Theme.palette.quaternary
                }}
              >
                {receiver}
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text style={{ marginRight: 7, ...DarkTheme.h1 }}>
                  {amount}
                </Text>
                <Text
                  style={{
                    lineHeight: 30,
                    ...DarkTheme.h5
                  }}
                >
                  {symbol}
                </Text>
              </View>
            </View>

            {(memo || '') !== '' && (
              <SubItem title="Memo" description={memo || ''} />
            )}

            <SubItem
              title="Remaining Amount"
              description={`${balance} ${symbol}`}
            />
          </View>

          <Button
            mode="contained"
            color="#fff"
            onPress={this.moveToActivity}
            style={{ padding: 5, margin: Theme.innerSpacing }}
          >
            Close
          </Button>
        </BackgroundView>
      </AndroidBackHandler>
    );
  }
}
