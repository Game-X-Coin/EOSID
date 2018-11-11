import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import { View, Image } from 'react-native';
import { Title, Text, TouchableRipple, Appbar } from 'react-native-paper';
import { Icon, Svg } from 'expo';

import { ScrollView, BackgroundView } from '../../../components/View';

import { AccountSelectDrawer } from './AccountSelectDrawer';
import { Theme } from '../../../constants';
import { SkeletonIndicator } from '../../../components/Indicator';

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

  showDrawer() {
    this.drawerVisible = true;
  }

  hideDrawer() {
    this.drawerVisible = false;
  }

  moveScreen = (...args) => this.props.navigation.navigate(...args);

  render() {
    const { info, tokens, fetched, currentAccount } = this.props.accountStore;

    const { cpu_weight = 0, net_weight = 0 } = info;

    const delegatedCPU = cpu_weight * 0.0001;
    const delegatedNET = net_weight * 0.0001;
    const undelegatedAmount =
      Object.keys(tokens).length && parseFloat(tokens.EOS);
    const totalAsset = delegatedCPU + delegatedNET + undelegatedAmount;

    const BalanceIndicator = () => (
      <SkeletonIndicator width={200} height={65}>
        <Svg.Rect x="0" y="0" rx="4" ry="4" width="200" height="35" />
        <Svg.Rect x="50" y="50" rx="4" ry="4" width="100" height="15" />
      </SkeletonIndicator>
    );

    const TokenIndicator = () => (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 10,
          paddingHorizontal: Theme.innerPadding
        }}
      >
        <SkeletonIndicator width={35} height={35}>
          <Svg.Circle cx="17.5" cy="17.5" r="17.5" />
        </SkeletonIndicator>

        <View style={{ flex: 1, marginLeft: 15 }}>
          <SkeletonIndicator width="100%" height={30}>
            <Svg.Rect x="0" y="2.5" rx="4" ry="4" width="100%" height="25" />
          </SkeletonIndicator>
        </View>
      </View>
    );

    const CustomAppbar = () => (
      <Appbar.Header style={{ marginTop: 30, backgroundColor: 'transparent' }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <TouchableRipple borderless onPress={() => this.showDrawer()}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ padding: 15, fontSize: 17 }}>
                {currentAccount.name}
              </Text>
              <Icon.Ionicons name="ios-arrow-down" size={17} />
            </View>
          </TouchableRipple>
          <View style={{ flex: 1 }} />
        </View>
        <Appbar.Action
          color="#bababa"
          icon="vpn-key"
          // onPress={() => this.moveScreen('ImportAccount')}
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

        <BackgroundView>
          <CustomAppbar />

          <View
            style={{
              marginTop: 35,
              marginBottom: 25,
              alignItems: 'center'
            }}
          >
            {fetched ? (
              <React.Fragment>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    marginBottom: 5
                  }}
                >
                  <Title style={{ fontSize: 35, lineHeight: 35 }}>
                    {totalAsset.toFixed(4)}
                  </Title>
                  <Text style={{ marginLeft: 7, fontSize: 15, lineHeight: 35 }}>
                    EOS
                  </Text>
                </View>
                <Text>Total Balance</Text>
              </React.Fragment>
            ) : (
              <BalanceIndicator />
            )}
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: Theme.innerSpacing,
              backgroundColor: Theme.mainBackgroundColor,
              borderRadius: Theme.innerBorderRadius,
              ...Theme.shadow
            }}
          >
            <TouchableRipple style={{ flex: 1, padding: Theme.innerPadding }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon.Ionicons
                  name="md-arrow-up"
                  color={Theme.secondary}
                  size={30}
                />
                <Title style={{ marginLeft: 15, fontSize: 17 }}>Transfer</Title>
              </View>
            </TouchableRipple>
            <View style={{ width: 1, backgroundColor: '#d8d8d8' }} />
            <TouchableRipple style={{ flex: 1, padding: Theme.innerPadding }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon.Ionicons
                  name="md-arrow-down"
                  color={Theme.teritary}
                  size={30}
                />
                <Title style={{ marginLeft: 15, fontSize: 17 }}>Receive</Title>
              </View>
            </TouchableRipple>
          </View>

          <TouchableRipple
            style={{ margin: Theme.innerSpacing, padding: 15 }}
            onPress={() => this.moveScreen('ManageResource')}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text style={{ marginRight: 15, fontSize: 17 }}>
                Manage Resource
              </Text>
              <Icon.Ionicons name="ios-arrow-forward" size={17} />
            </View>
          </TouchableRipple>

          {/* Tokens */}
          <View
            style={{
              flex: 1,
              marginHorizontal: Theme.innerSpacing,
              backgroundColor: Theme.mainBackgroundColor,
              borderTopRadius: Theme.innerBorderRadius,
              ...Theme.shadow
            }}
          >
            <ScrollView>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 50
                }}
              >
                <View
                  style={{
                    marginBottom: 5,
                    width: 25,
                    height: 2,
                    backgroundColor: '#d8d8d8'
                  }}
                />
                <View
                  style={{ width: 25, height: 2, backgroundColor: '#d8d8d8' }}
                />
              </View>

              {fetched
                ? Object.keys(tokens).map(symbol => (
                    <TouchableRipple
                      key={symbol}
                      style={{
                        paddingHorizontal: Theme.innerPadding
                      }}
                      onPress={() => this.moveScreen('Transfer', { symbol })}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}
                      >
                        <Image
                          style={{ marginRight: 15, width: 35, height: 35 }}
                          source={{
                            uri:
                              'https://cdn.freebiesupply.com/logos/large/2x/eos-3-logo-png-transparent.png'
                          }}
                        />
                        <Title
                          style={{ flex: 1, paddingVertical: 15, fontSize: 17 }}
                        >
                          {symbol}
                        </Title>
                        <Title style={{ fontSize: 17 }}>{tokens[symbol]}</Title>
                      </View>
                    </TouchableRipple>
                  ))
                : Array.from({ length: 4 }, (v, key) => (
                    <TokenIndicator key={key} />
                  ))}
            </ScrollView>
          </View>
        </BackgroundView>
      </React.Fragment>
    );
  }
}
