import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { ScrollView, Text, View } from 'react-native';
import { Appbar, Divider, Caption } from 'react-native-paper';
import moment from 'moment';

import HomeStyle from '../../../styles/HomeStyle';
import { PageIndicator } from '../../../components/Indicator';

@inject('networkStore')
@observer
export class TransactionDetailScreen extends Component {
  constructor() {
    super();

    this.state = {
      fetched: false,
      info: null
    };
  }

  async componentDidMount() {
    const {
      navigation: { state },
      networkStore: { eos }
    } = this.props;

    const txId = state.params.txId;
    const transaction = await eos.transactions.get({ id: txId });

    this.setState({ fetched: true, info: transaction });
  }

  render() {
    const { navigation } = this.props;
    const { fetched, info } = this.state;

    const Item = ({ title, description, children }) => (
      <View style={{ marginTop: 5, marginBottom: 5 }}>
        <Caption>{title}</Caption>
        {description && <Text>{description}</Text>}
        {children}
      </View>
    );

    const Badge = ({ title, color }) => (
      <View
        style={{
          paddingVertical: 3,
          paddingHorizontal: 7,
          marginRight: 5,
          backgroundColor: color,
          borderRadius: 3
        }}
      >
        <Text style={{ fontSize: 12, color: '#fff' }}>{title}</Text>
      </View>
    );

    return (
      <View style={HomeStyle.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack(null)} />
          <Appbar.Content title="Transaction Detail" />
        </Appbar.Header>

        {!fetched ? (
          <PageIndicator />
        ) : (
          <ScrollView style={{ flex: 1 }}>
            <View style={{ padding: 20 }}>
              <Item
                title="Transaction ID"
                description={navigation.state.params.txId}
              />

              <Item title="Transaction Status">
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Badge
                    title={info && info.trx.receipt.status}
                    color="#2185d0"
                  />
                  <Badge
                    title={
                      info && info.last_irreversible_block
                        ? 'irreversible'
                        : 'reversible'
                    }
                    color="#21ba45"
                  />
                </View>
              </Item>
              <Item
                title="CPU Usage"
                description={`${info && info.trx.receipt.cpu_usage_us} us`}
              />
              <Item
                title="Net Usage"
                description={`${info &&
                  info.trx.receipt.net_usage_words} words`}
              />
              <Item title="Block Number" description={info && info.block_num} />
              <Item
                title="Block Time"
                description={
                  info &&
                  `${moment(info.block_time).format('lll')} (${moment(
                    info.block_time
                  ).fromNow()})`
                }
              />

              <Divider style={{ marginVertical: 10 }} />

              <View>
                <Text style={{ fontSize: 18, marginBottom: 10 }}>Actions</Text>

                {fetched &&
                  info &&
                  info.trx.trx &&
                  info.trx.trx.actions.map((action, i) => (
                    <View key={i}>
                      <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                        <Text style={{ marginRight: 5 }}>{action.name}</Text>
                        <Caption>by {action.account}</Caption>
                      </View>

                      <Caption>{JSON.stringify(action.data)}</Caption>
                    </View>
                  ))}
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    );
  }
}
