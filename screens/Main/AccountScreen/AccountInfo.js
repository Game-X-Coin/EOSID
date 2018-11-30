import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import {
  View,
  Image,
  TouchableWithoutFeedback,
  Animated,
  Platform,
  PanResponder,
  StatusBar,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { Title, Text, TouchableRipple } from 'react-native-paper';
import { AndroidBackHandler } from 'react-navigation-backhandler';

import { Theme, DarkTheme } from '../../../constants';
import { PageIndicator } from '../../../components/Indicator';
import { BackgroundView, ScrollView } from '../../../components/View';
import { ArrowIcon } from '../../../components/SVG';
import TokenLogo from '../../../constants/TokenLogo';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;
const SWIPABLE_HEIGHT = 60;

@withNavigation
@inject('accountStore')
@observer
export class AccountInfo extends Component {
  @observable
  refreshing = false;

  @observable
  drawerVisible = false;

  @observable
  innerHeight = WINDOW_HEIGHT;

  // animate drawer
  drawerFrame = new Animated.Value(0);

  onRefresh = async () => {
    this.refreshing = true;

    await this.props.accountStore.getTokens();

    this.refreshing = false;
  };

  panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderMove: (...args) => this.panResponderMove(...args),
    onPanResponderRelease: (...args) => this.panResponderRelease(...args)
  });

  panResponderMove(evt, getsture) {
    const { moveY, y0 } = getsture;

    if (this.drawerVisible) {
      const pos = moveY - y0;

      if (pos > 0) {
        this.drawerFrame.setValue(1 - pos / this.innerHeight);
      }
    } else {
      const pos = y0 - moveY;

      if (pos > 0) {
        this.drawerFrame.setValue(pos / this.innerHeight);
      }
    }
  }

  panResponderRelease(evt, { moveY, vy }) {
    if (this.drawerVisible) {
      if (moveY > this.innerHeight / 2 || vy > 0.5) {
        this.hideDrawer();
      } else {
        this.showDrawer();
      }
    } else {
      if (moveY < this.innerHeight / 2 || vy < -0.5) {
        this.showDrawer();
      } else {
        this.hideDrawer();
      }
    }
  }

  showDrawer() {
    this.drawerVisible = true;

    Animated.timing(this.drawerFrame, {
      toValue: 1,
      duration: 200
    }).start();
  }

  hideDrawer() {
    this.drawerVisible = false;

    Animated.timing(this.drawerFrame, {
      toValue: 0,
      duration: 200
    }).start();
  }

  onBackPress() {
    if (this.drawerVisible) {
      this.hideDrawer();
      return true;
    }

    return false;
  }

  moveScreen = (...args) => this.props.navigation.navigate(...args);

  render() {
    const {
      info: { total_resources: { cpu_weight = 0, net_weight = 0 } = {} },
      tokens,
      fetched,
      currentAccount
    } = this.props.accountStore;

    const stakedBalance = parseFloat(cpu_weight) + parseFloat(net_weight);
    const unstakedBalance = tokens.EOS
      ? parseFloat(tokens.EOS.amount).toFixed(4)
      : 0;

    const ActionItem = ({ icon, name, description, onPress }) => (
      <View
        style={{
          marginBottom: 15,
          ...Theme.surface,
          ...Theme.shadow
        }}
      >
        <TouchableRipple onPress={onPress}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 20
            }}
          >
            <Image
              style={{
                padding: 5,
                width: 17,
                height: 17
              }}
              source={icon}
            />
            <Text
              style={{
                flex: 1,
                marginLeft: 20,
                paddingVertical: 14,
                ...Theme.h5
              }}
            >
              {name}
            </Text>

            {description && (
              <Text style={{ ...Theme.p, color: Theme.palette.darkGray }}>
                {description}
              </Text>
            )}
          </View>
        </TouchableRipple>
      </View>
    );

    return (
      <AndroidBackHandler onBackPress={() => this.onBackPress()}>
        <BackgroundView dark>
          <SafeAreaView style={{ flex: 1 }}>
            <View
              style={{ flex: 1 }}
              onLayout={event => {
                this.innerHeight = event.nativeEvent.layout.height;
              }}
            >
              <Animated.View
                style={{
                  opacity: this.drawerFrame.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0]
                  })
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: Theme.innerSpacing - 5,
                    paddingTop: 15 + STATUS_BAR_HEIGHT
                  }}
                >
                  <View style={{ flex: 1 }} />
                  <TouchableRipple
                    borderless
                    style={{ padding: 5 }}
                    onPress={() => this.moveScreen('Permission')}
                  >
                    <Image
                      style={{
                        width: 30,
                        height: 30
                      }}
                      source={require('../../../assets/icons/account.png')}
                    />
                  </TouchableRipple>
                </View>

                <View
                  style={{
                    marginVertical: 50
                  }}
                >
                  <Text
                    style={{
                      marginBottom: 5,
                      textAlign: 'center',
                      ...DarkTheme.h5
                    }}
                  >
                    Total Balance
                  </Text>
                  {fetched ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        justifyContent: 'center'
                      }}
                    >
                      <Text
                        style={{
                          marginRight: 7,
                          fontSize: 37,
                          color: DarkTheme.text.color
                        }}
                      >
                        {unstakedBalance}
                      </Text>
                      <Text
                        style={{
                          lineHeight: 37,
                          ...DarkTheme.h4
                        }}
                      >
                        EOS
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={{
                        textAlign: 'center',
                        lineHeight: 50,
                        ...DarkTheme.h3
                      }}
                    >
                      Fetching balance...
                    </Text>
                  )}
                </View>

                <View
                  style={{
                    marginHorizontal: Theme.innerSpacing
                  }}
                >
                  <ActionItem
                    name="Transfer"
                    icon={require('../../../assets/icons/transfer.png')}
                    onPress={() => this.moveScreen('Transfer')}
                  />

                  <ActionItem
                    name="Resource"
                    description={fetched && `${stakedBalance} EOS`}
                    icon={require('../../../assets/icons/resource.png')}
                    onPress={() => this.moveScreen('Resource')}
                  />
                </View>
              </Animated.View>

              <View
                style={{ flex: 1, backgroundColor: 'transparent' }}
                {...this.panResponder.panHandlers}
              >
                <View
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: SWIPABLE_HEIGHT + 10,
                    alignItems: 'center',
                    opacity: 0.5
                  }}
                >
                  <ArrowIcon scale="1.5" />
                </View>
              </View>

              <Animated.View
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  top: 0,
                  zIndex: 9999,
                  marginHorizontal: this.drawerFrame.interpolate({
                    inputRange: [0, 1],
                    outputRange: [Theme.innerSpacing, 0]
                  }),
                  borderRadius: this.drawerFrame.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0]
                  }),
                  transform: [
                    {
                      translateY: this.drawerFrame.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                          this.innerHeight - SWIPABLE_HEIGHT,
                          STATUS_BAR_HEIGHT
                        ]
                      })
                    }
                  ],
                  overflow: 'hidden'
                }}
              >
                <View {...this.panResponder.panHandlers}>
                  <TouchableWithoutFeedback
                    onPress={() => !this.drawerVisible && this.showDrawer()}
                  >
                    <Animated.View
                      style={{
                        backgroundColor: this.drawerFrame.interpolate({
                          inputRange: [0, 1],
                          outputRange: [
                            DarkTheme.surface.backgroundColor,
                            DarkTheme.app.backgroundColor
                          ]
                        })
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingHorizontal: Theme.innerPadding,
                          height: SWIPABLE_HEIGHT
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center'
                          }}
                        >
                          <Text style={{ fontWeight: '500', ...DarkTheme.h4 }}>
                            {currentAccount.name}
                          </Text>
                          <Text style={DarkTheme.h4}>'s tokens</Text>
                        </View>
                      </View>

                      <Image
                        resizeMode="contain"
                        source={require('../../../assets/logos/eos_large.png')}
                        style={{
                          position: 'absolute',
                          right: 10,
                          top: 70,
                          opacity: 0.5,
                          height: 180
                        }}
                      />

                      <View
                        style={{
                          paddingHorizontal: 30,
                          marginTop: 80,
                          marginBottom: 30
                        }}
                      >
                        <Text
                          style={{
                            marginBottom: 5,
                            ...DarkTheme.h5
                          }}
                        >
                          Total Balance
                        </Text>
                        {fetched ? (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'flex-end'
                            }}
                          >
                            <Text
                              style={{
                                marginRight: 7,
                                fontSize: 37,
                                color: DarkTheme.text.color
                              }}
                            >
                              {unstakedBalance}
                            </Text>
                            <Text
                              style={{
                                lineHeight: 37,
                                ...DarkTheme.h4
                              }}
                            >
                              EOS
                            </Text>
                          </View>
                        ) : (
                          <Text
                            style={{
                              lineHeight: 50,
                              ...DarkTheme.h3
                            }}
                          >
                            Fetching balance...
                          </Text>
                        )}
                      </View>

                      <View
                        style={{
                          marginBottom: 10,
                          alignItems: 'center',
                          opacity: 0.5
                        }}
                      >
                        <ArrowIcon down scale="1.5" />
                      </View>
                    </Animated.View>
                  </TouchableWithoutFeedback>
                </View>

                <View
                  style={{
                    flex: 1,
                    backgroundColor: Theme.surface.backgroundColor
                  }}
                >
                  {!fetched ? (
                    <PageIndicator />
                  ) : (
                    <ScrollView
                      refreshing={this.refreshing}
                      onRefresh={this.onRefresh}
                    >
                      {Object.keys(tokens).map(symbol => (
                        <TouchableRipple
                          key={symbol}
                          style={{
                            paddingHorizontal: Theme.innerPadding
                          }}
                          onPress={() =>
                            this.moveScreen('Transfer', { symbol })
                          }
                        >
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center'
                            }}
                          >
                            {TokenLogo[tokens[symbol].code] &&
                            TokenLogo[tokens[symbol].code][symbol] ? (
                              <Image
                                style={{
                                  marginRight: 15,
                                  width: 40,
                                  height: 40,
                                  borderRadius: 20
                                }}
                                resizeMode="contain"
                                source={TokenLogo[tokens[symbol].code][symbol]}
                              />
                            ) : (
                              <Image
                                style={{
                                  marginRight: 15,
                                  width: 40,
                                  height: 40
                                }}
                                source={require('../../../assets/images/token_logo/eos.png')}
                              />
                            )}
                            <Title
                              style={{
                                flex: 1,
                                paddingVertical: 25,
                                ...Theme.h5
                              }}
                            >
                              {symbol}
                            </Title>
                            <Title style={Theme.h5}>
                              {tokens[symbol].amount}
                            </Title>
                          </View>
                        </TouchableRipple>
                      ))}
                    </ScrollView>
                  )}
                </View>
              </Animated.View>
            </View>
          </SafeAreaView>
        </BackgroundView>
      </AndroidBackHandler>
    );
  }
}
