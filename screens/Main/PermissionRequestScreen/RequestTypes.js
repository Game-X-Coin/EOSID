import React, { Component } from 'react';
import { View } from 'react-native';
import { Text, Colors, Caption } from 'react-native-paper';
import { Icon } from 'expo';

export class AuthorizeRequest extends Component {
  render() {
    return <Text>Access readonly info (accout name, balance, etc.)</Text>;
  }
}

export class TransferRequest extends Component {
  render() {
    const {
      transfer = {
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{ actor: 'iameunseokgo', permission: 'active' }],
        data: {
          from: 'iameunseokgo',
          to: 'eosbetdice11',
          quantity: '1232131230.9046 EOS',
          memo:
            '50-weddingdress-wqdwdjnqwdkjqwndkjqnwjwqdwdjnqwdkjqwndkjqnwjwqdwdjnqwdkjqwndkjqnwj'
        }
      }
    } = this.props;

    return (
      <View
        style={{
          marginTop: 5,
          padding: 20,
          backgroundColor: Colors.grey800,
          borderRadius: 3
        }}
      >
        <Text style={{ color: Colors.grey200 }}>
          Transfer to{' '}
          <Text style={{ fontWeight: 'bold', color: Colors.grey200 }}>
            {transfer.data.to}
          </Text>
        </Text>
        <Text
          style={{
            marginTop: 5,
            marginBottom: 10,
            fontSize: 25,
            color: '#fff'
          }}
        >
          {transfer.data.quantity}
        </Text>

        {transfer.data.memo.length && (
          <View
            style={{
              padding: 7,
              backgroundColor: Colors.grey600,
              borderRadius: 3
            }}
          >
            <Caption style={{ color: Colors.grey200 }}>
              {transfer.data.memo}
            </Caption>
          </View>
        )}
      </View>
    );
  }
}

export class TransactionRequest extends Component {
  render() {
    const {
      transaction = [
        {
          account: 'eosknightsio',
          name: 'rebirth2',
          authorization: [
            {
              actor: 'iameunseokgo',
              permission: 'active'
            }
          ],
          data: {
            from: 'iameunseokgo',
            block: 21999938,
            checksum: 670834896
          }
        },
        {
          account: 'eosio',
          name: 'delegatebw',
          authorization: [{ actor: 'iameunseokgo', permission: 'active' }],
          data: {
            from: 'iameunseokgo',
            receiver: 'gxcgamexcoin',
            stake_net_quantity: '0.2000 EOS',
            stake_cpu_quantity: '0.2000 EOS'
          }
        }
      ]
    } = this.props;

    return transaction.map(({ name, account, authorization, data }, k) => (
      <View
        key={k}
        style={{ flexDirection: 'row', marginTop: k !== 0 ? 5 : 0 }}
      >
        <View style={{ paddingTop: 10, paddingLeft: 5, paddingRight: 15 }}>
          <Icon.Ionicons
            name="ios-checkmark-circle"
            size={27}
            color={Colors.green500}
          />
        </View>

        <View style={{ flex: 1, paddingVertical: 5 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 15, marginRight: 5 }}>{name}</Text>
            <Caption>by {account}</Caption>
          </View>

          <View>
            <Caption>{JSON.stringify(data)}</Caption>
          </View>

          <View style={{ flexDirection: 'row' }}>
            {authorization.map((auth, ak) => (
              <View
                key={ak}
                style={{
                  paddingVertical: 3,
                  paddingHorizontal: 7,
                  marginRight: 5,
                  backgroundColor: Colors.blue500,
                  borderRadius: 3
                }}
              >
                <Text style={{ fontSize: 12, color: '#fff' }}>
                  {auth.actor}@{auth.permission}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    ));
  }
}
