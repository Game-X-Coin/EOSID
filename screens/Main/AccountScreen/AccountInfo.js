import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import { View } from 'react-native';
import {
  Colors,
  ProgressBar,
  Title,
  Text,
  Divider,
  TouchableRipple,
  Caption,
  Button
} from 'react-native-paper';
import { LinearGradient } from 'expo';
import bytes from 'bytes';
import prettyMs from 'pretty-ms';

import { PageIndicator } from '../../../components/Indicator';
import { ScrollView } from '../../../components/View';

const ItemTitle = ({ title }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10
    }}
  >
    <Caption>{title}</Caption>

    <Divider style={{ flex: 1, marginLeft: 10 }} />
  </View>
);

const DelegatedItem = ({ title, subTitle, amount, percentage, color }) => (
  <View>
    <View style={{ flexDirection: 'row' }}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'flex-start'
        }}
      >
        <Text style={{ marginRight: 5, fontSize: 15 }}>{title}</Text>
        <Caption>{subTitle}</Caption>
      </View>

      <Text>{amount && `${amount.toFixed(4)} EOS`}</Text>
    </View>
    <ProgressBar
      progress={percentage}
      color={color}
      style={{ paddingVertical: 8 }}
    />
  </View>
);

@withNavigation
@inject('accountStore')
@observer
export class AccountInfo extends Component {
  @observable
  refreshing = false;

  onRefresh = async () => {
    this.refreshing = true;

    await Promise.all([
      this.props.accountStore.getInfo(),
      this.props.accountStore.getTokens()
    ]);

    this.refreshing = false;
  };

  prettyBytes(value) {
    return bytes(value, { thousandsSeparator: ',' });
  }

  prettyTime(value) {
    return prettyMs(value * 0.001);
  }

  moveScreen = (...args) => this.props.navigation.navigate(...args);

  render() {
    const { info, tokens, fetched } = this.props.accountStore;

    const {
      account_name,
      cpu_limit,
      cpu_weight,
      net_limit,
      net_weight,
      ram_usage,
      ram_quota,
      refund_request
    } = info;

    const delegatedCPU = cpu_weight * 0.0001;
    const delegatedNET = net_weight * 0.0001;
    const refundAmount =
      refund_request &&
      Number(refund_request.cpu_amount.split(' ')[0]) +
        Number(refund_request.net_amount.split(' ')[0]);
    const undelegatedAmount = parseFloat(tokens.EOS);
    const totalAsset = delegatedCPU + delegatedNET + undelegatedAmount;

    if (!fetched) {
      return <PageIndicator />;
    }

    return (
      <ScrollView
        refreshing={this.refreshing}
        onRefresh={this.onRefresh}
        style={{ flex: 1, padding: 20 }}
      >
        <LinearGradient
          colors={[Colors.grey700, Colors.grey900]}
          start={[1, 0]}
          end={[0, 1]}
          style={{
            marginBottom: 15,
            padding: 20,
            borderRadius: 5
          }}
        >
          <Text style={{ color: '#fff', fontSize: 17, paddingBottom: 15 }}>
            {account_name}
          </Text>
          <Title style={{ color: '#fff', fontSize: 25 }}>
            {totalAsset.toFixed(4)} EOS
          </Title>
        </LinearGradient>

        <View style={{ paddingBottom: 15 }}>
          <ItemTitle title="Resources" />

          <DelegatedItem
            title="CPU"
            subTitle={`(${this.prettyTime(cpu_limit.used)} / ${this.prettyTime(
              cpu_limit.max
            )})`}
            amount={delegatedCPU}
            percentage={cpu_limit.used / cpu_limit.max}
            color={Colors.blue700}
          />

          <DelegatedItem
            title="Network"
            subTitle={`(${this.prettyBytes(
              net_limit.used
            )} / ${this.prettyBytes(net_limit.max)})`}
            amount={delegatedNET}
            percentage={cpu_limit.used / cpu_limit.max}
            color={Colors.green700}
          />

          {refund_request && (
            <DelegatedItem
              title="Refunding"
              subTitle={refund_request.request_time}
              amount={refundAmount}
              percentage={refundAmount / (delegatedCPU + delegatedNET)}
              color={Colors.orange700}
            />
          )}

          <DelegatedItem
            title="RAM"
            subTitle={`(${this.prettyBytes(ram_usage)} / ${this.prettyBytes(
              ram_quota
            )})`}
            percentage={ram_usage / ram_quota}
            color={Colors.purple800}
          />

          <Button
            style={{ marginTop: 5 }}
            onPress={() => this.moveScreen('ManageResource')}
          >
            Manage Resource
          </Button>
        </View>

        <View>
          <ItemTitle title="Tokens" />

          {Object.keys(tokens).map(symbol => (
            <TouchableRipple
              key={symbol}
              onPress={() => this.moveScreen('Transfer', { symbol })}
            >
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: -5,
                  paddingHorizontal: 5,
                  paddingVertical: 10
                }}
              >
                <Text style={{ flex: 1, fontSize: 17 }}>{symbol}</Text>
                <Text style={{ fontSize: 17 }}>{tokens[symbol]}</Text>
              </View>
            </TouchableRipple>
          ))}
        </View>
      </ScrollView>
    );
  }
}
