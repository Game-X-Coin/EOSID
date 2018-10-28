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
  Button,
  Appbar
} from 'react-native-paper';
import { Icon, LinearGradient } from 'expo';
import bytes from 'bytes';
import prettyMs from 'pretty-ms';

import { PageIndicator } from '../../../components/Indicator';
import { ScrollView } from '../../../components/View';

import { AccountSelectDrawer } from './AccountSelectDrawer';

const ItemTitle = ({ title, style }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      ...style
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
  drawerVisible = false;

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

  showDrawer() {
    this.drawerVisible = true;
  }

  hideDrawer() {
    this.drawerVisible = false;
  }

  moveScreen = (...args) => this.props.navigation.navigate(...args);

  render() {
    const {
      info,
      tokens,
      fetched,
      currentUserAccount
    } = this.props.accountStore;

    const {
      cpu_limit = { max: 0, used: 0 },
      cpu_weight = 0,
      net_limit = { max: 0, used: 0 },
      net_weight = 0,
      ram_usage = 0,
      ram_quota = 0,
      refund_request
    } = info;

    const delegatedCPU = cpu_weight * 0.0001;
    const delegatedNET = net_weight * 0.0001;
    const undelegatedAmount =
      Object.keys(tokens).length && parseFloat(tokens.EOS);
    const totalAsset = delegatedCPU + delegatedNET + undelegatedAmount;
    const refundAmount =
      refund_request &&
      Number(refund_request.cpu_amount.split(' ')[0]) +
        Number(refund_request.net_amount.split(' ')[0]);

    const CustomAppbar = () => (
      <Appbar.Header dark style={{ backgroundColor: 'transparent' }}>
        <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 15 }}>
          <TouchableRipple borderless onPress={() => this.showDrawer()}>
            <Title
              style={{
                color: '#fff',
                fontSize: 18
              }}
            >
              {currentUserAccount.name}{' '}
              <Icon.Ionicons name="md-arrow-dropdown" size={18} />
            </Title>
          </TouchableRipple>
          <View style={{ flex: 1 }} />
        </View>
        <Appbar.Action
          icon="add"
          onPress={() => this.moveScreen('ImportAccount')}
        />
      </Appbar.Header>
    );

    return (
      <React.Fragment>
        {/* Drawer */}
        <AccountSelectDrawer
          visible={this.drawerVisible}
          onHide={() => this.hideDrawer()}
        />

        <ScrollView refreshing={this.refreshing} onRefresh={this.onRefresh}>
          <LinearGradient
            colors={['#3023ae', '#c86dd7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <CustomAppbar />

            <View
              style={{
                paddingTop: 15,
                paddingBottom: 35,
                alignItems: 'center'
              }}
            >
              <Title style={{ marginBottom: 5, color: '#fff', fontSize: 25 }}>
                {fetched ? `${totalAsset.toFixed(4)} EOS` : 'fetch assets...'}
              </Title>

              <Text style={{ color: '#fff' }}>TOTAL BALANCE</Text>
            </View>
          </LinearGradient>

          {!fetched ? (
            <PageIndicator style={{ height: 300 }} />
          ) : (
            <React.Fragment>
              {/* Resources */}
              <View style={{ padding: 20 }}>
                <ItemTitle title="Resources" />

                <DelegatedItem
                  title="CPU"
                  subTitle={`(${this.prettyTime(
                    cpu_limit.used
                  )} / ${this.prettyTime(cpu_limit.max)})`}
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
                  subTitle={`(${this.prettyBytes(
                    ram_usage
                  )} / ${this.prettyBytes(ram_quota)})`}
                  percentage={ram_usage / ram_quota}
                  color={Colors.grey900}
                />

                <Button
                  style={{ marginTop: 5 }}
                  onPress={() => this.moveScreen('ManageResource')}
                >
                  Manage Resource
                </Button>
              </View>

              {/* Tokens */}
              <View style={{ paddingBottom: 20 }}>
                <ItemTitle title="Tokens" style={{ paddingHorizontal: 20 }} />
                {Object.keys(tokens).map(symbol => (
                  <TouchableRipple
                    key={symbol}
                    onPress={() => this.moveScreen('Transfer', { symbol })}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingHorizontal: 20,
                        paddingVertical: 10
                      }}
                    >
                      <Text style={{ flex: 1, fontSize: 17 }}>{symbol}</Text>
                      <Text style={{ fontSize: 17 }}>{tokens[symbol]}</Text>
                    </View>
                  </TouchableRipple>
                ))}

                <Button
                  style={{ marginTop: 5, marginHorizontal: 20 }}
                  onPress={() => this.moveScreen('Transfer')}
                >
                  Transfer Token
                </Button>
              </View>
            </React.Fragment>
          )}
        </ScrollView>
      </React.Fragment>
    );
  }
}
