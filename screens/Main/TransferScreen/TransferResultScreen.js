import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { SafeAreaView, View } from 'react-native';
import { Colors, Button, Text, Appbar } from 'react-native-paper';
import { TextField } from 'react-native-material-textfield';

import { Theme } from '../../../constants';

import { EmptyState } from '../../../components/EmptyState';
import { ScrollView } from '../../../components/View';

@inject('accountStore')
@observer
export class TransferResultScreen extends Component {
  confirm() {
    this.props.navigation.navigate('Account');
  }

  render() {
    const { navigation, accountStore } = this.props;
    const { error, amount, symbol, receiver, memo } =
      navigation.state.params || {};

    const balance = symbol && accountStore.tokens[symbol];

    if (error) {
      return (
        <EmptyState
          image={require('../../../assets/example.png')}
          title="Transfer Failed"
          description="Please check the error, it may be a network error."
          descriptionStyle={{ marginBottom: 20 }}
        >
          <View
            style={{
              marginBottom: 25,
              marginHorizontal: 30,
              height: 150,
              backgroundColor: Colors.grey300,
              borderRadius: 5
            }}
          >
            <ScrollView style={{ padding: 10 }}>
              <Text style={{ color: Colors.grey700 }}>
                {JSON.stringify(this.error)}
              </Text>
            </ScrollView>
          </View>

          <Button mode="outlined" onPress={() => this.confirm()}>
            Confirm
          </Button>
        </EmptyState>
      );
    }

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Theme.primary }}>
        <Appbar.Header dark style={{ backgroundColor: 'transparent' }}>
          <Appbar.Action icon="close" onPress={() => this.confirm()} />
          <Appbar.Content title="Transfer Result" />
        </Appbar.Header>

        <View style={{ flex: 1, padding: 20, paddingTop: 30 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ paddingBottom: 10, fontSize: 20, color: '#fff' }}>
              {receiver}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 30, marginRight: 5, color: '#fff' }}>
                {amount}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  marginRight: 5,
                  lineHeight: 30,
                  color: '#fff'
                }}
              >
                {symbol}
              </Text>
            </View>
          </View>

          {memo && (
            <TextField
              multiline
              label="Memo"
              baseColor="#fff"
              textColor="#fff"
              value={memo}
              editable={false}
            />
          )}

          <TextField
            multiline
            label="Remaining amount"
            baseColor="#fff"
            textColor="#fff"
            value={`${balance} ${symbol}`}
            editable={false}
          />
        </View>

        <Button
          style={{ padding: 5, margin: 20 }}
          mode="contained"
          color="#fff"
          onPress={() => this.confirm()}
        >
          Confirm
        </Button>
      </SafeAreaView>
    );
  }
}
