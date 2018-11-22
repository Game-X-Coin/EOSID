import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { View } from 'react-native';
import { Button, Text, Appbar } from 'react-native-paper';
import { AndroidBackHandler } from 'react-navigation-backhandler';

import { Theme } from '../../../constants';

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
        <Text style={{ marginBottom: 7, fontSize: 17, color: Theme.secondary }}>
          {title}
        </Text>
        <Text style={{ fontSize: 17, color: '#fff' }}>{description}</Text>
      </View>
    );

    return (
      <AndroidBackHandler onBackPress={this.onBackPress}>
        <View style={{ flex: 1, backgroundColor: Theme.primary }}>
          <Appbar.Header dark style={{ backgroundColor: 'transparent' }}>
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
                  color: Theme.secondary
                }}
              >
                {receiver}
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 30, marginRight: 7, color: '#fff' }}>
                  {amount}
                </Text>
                <Text
                  style={{
                    fontSize: 17,
                    lineHeight: 30,
                    color: '#fff'
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
            style={{ padding: 5, margin: Theme.innerSpacing }}
            mode="contained"
            color="#fff"
            onPress={this.moveToActivity}
          >
            Close
          </Button>
        </View>
      </AndroidBackHandler>
    );
  }
}
