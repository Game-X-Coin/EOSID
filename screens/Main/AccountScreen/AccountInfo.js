import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import {
  View,
  Image,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Platform,
  PanResponder,
  StatusBar
} from 'react-native';
import { Title, Text, TouchableRipple } from 'react-native-paper';
import { Icon } from 'expo';
import { AndroidBackHandler } from 'react-navigation-backhandler';

import { Theme, DarkTheme } from '../../../constants';
import { PageIndicator } from '../../../components/Indicator';
import { BackgroundView, ScrollView } from '../../../components/View';
import Chains from '../../../constants/Chains';

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

@withNavigation
@inject('accountStore')
@observer
export class AccountInfo extends Component {
  @observable
  drawerVisible = false;

  // animate drawer
  drawerFrame = new Animated.Value(0);

  panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderMove: (...args) => this.panResponderMove(...args),
    onPanResponderRelease: (...args) => this.panResponderRelease(...args)
  });

  panResponderMove(evt, { moveY, y0, ...g }) {
    if (this.drawerVisible) {
      this.drawerFrame.setValue(y0 / moveY);
    } else {
      this.drawerFrame.setValue(1 - moveY / y0);
    }
  }

  panResponderRelease(evt, { moveY, vy }) {
    const { height } = Dimensions.get('window');

    if (this.drawerVisible) {
      if (moveY > height / 2 || vy > 0.5) {
        this.hideDrawer();
      } else {
        this.showDrawer();
      }
    } else {
      if (moveY < height / 2 || vy < -0.5) {
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
      duration: 150
    }).start();
  }

  hideDrawer() {
    this.drawerVisible = false;

    Animated.timing(this.drawerFrame, {
      toValue: 0,
      duration: 150
    }).start();
  }

  onBackPress = () => {
    if (this.drawerVisible) {
      this.hideDrawer();
      return true;
    }

    return false;
  };

  moveScreen = (...args) => this.props.navigation.navigate(...args);

  render() {
    const { tokens, fetched, currentAccount } = this.props.accountStore;
    const chain = Chains.find(chain => chain.id === currentAccount.chainId);

    const ActionItem = ({ icon, name, onPress }) => (
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
                paddingHorizontal: 10,
                width: 20,
                height: 20
              }}
              source={icon}
            />
            <Title
              style={{ marginLeft: 25, paddingVertical: 14, fontSize: 18 }}
            >
              {name}
            </Title>
          </View>
        </TouchableRipple>
      </View>
    );

    return (
      <AndroidBackHandler onBackPress={this.onBackPress}>
        <BackgroundView dark>
          <Animated.View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingTop: 15 + STATUS_BAR_HEIGHT,
              opacity: this.drawerFrame.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
              })
            }}
          >
            <View style={{ flex: 1 }} />
            <TouchableRipple
              borderless
              onPress={() => this.moveScreen('Permission')}
            >
              <Image
                style={{
                  width: 30,
                  height: 30
                }}
                source={require('../../../assets/icons/permission.png')}
              />
            </TouchableRipple>
          </Animated.View>

          <Animated.View
            style={{
              marginTop: 60,
              marginHorizontal: 25,
              opacity: this.drawerFrame.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
              })
            }}
          >
            <ActionItem
              name="Transfer"
              icon={require('../../../assets/icons/transfer.png')}
              onPress={() => this.moveScreen('Transfer')}
            />

            <ActionItem
              name="Resource"
              icon={require('../../../assets/icons/resource.png')}
              onPress={() => this.moveScreen('Resource')}
            />
          </Animated.View>

          <View
            style={{ flex: 1, backgroundColor: 'transparent' }}
            {...this.panResponder.panHandlers}
          />

          <Animated.View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              top: this.drawerFrame.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  Dimensions.get('window').height - 120,
                  STATUS_BAR_HEIGHT
                ]
              }),
              zIndex: 9999,
              marginHorizontal: this.drawerFrame.interpolate({
                inputRange: [0, 1],
                outputRange: [15, 0]
              }),
              borderTopLeftRadius: this.drawerFrame.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 0]
              }),
              borderTopRightRadius: this.drawerFrame.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 0]
              }),
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
                      outputRange: ['#343a40', DarkTheme.app.backgroundColor]
                    })
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 20,
                      height: 60
                    }}
                  >
                    <Animated.View
                      style={{
                        opacity: this.drawerFrame.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1]
                        }),
                        marginLeft: this.drawerFrame.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-50, 0]
                        })
                      }}
                    >
                      <TouchableRipple
                        borderless
                        onPress={() => this.hideDrawer()}
                      >
                        <Icon.Ionicons
                          name="md-arrow-back"
                          size={24}
                          color={DarkTheme.text.color}
                          style={{ padding: 5 }}
                        />
                      </TouchableRipple>
                    </Animated.View>

                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingLeft: 30
                      }}
                    >
                      <Text style={{ fontWeight: '500', ...DarkTheme.h4 }}>
                        {currentAccount.name}
                      </Text>
                      <Text style={DarkTheme.h4}>'s assets</Text>
                    </View>
                  </View>

                  <View
                    style={{
                      paddingHorizontal: 20,
                      marginTop: 50,
                      marginBottom: 20
                    }}
                  >
                    {fetched ? (
                      <View>
                        <Text
                          style={{
                            ...DarkTheme.text,
                            marginBottom: 5,
                            opacity: 0.8
                          }}
                        >
                          Total
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'flex-end'
                          }}
                        >
                          <Text style={{ marginRight: 7, ...DarkTheme.h1 }}>
                            {tokens.EOS}
                          </Text>
                          <Text
                            style={{
                              lineHeight: DarkTheme.h1.fontSize,
                              ...DarkTheme.h5
                            }}
                          >
                            EOS
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <Text style={DarkTheme.h3}>Fetching assets...</Text>
                    )}
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
                <ScrollView>
                  {Object.keys(tokens).map(symbol => (
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
                          style={{ marginRight: 15, width: 40, height: 40 }}
                          source={{
                            uri:
                              'https://cdn.freebiesupply.com/logos/large/2x/eos-3-logo-png-transparent.png'
                          }}
                        />
                        <Title
                          style={{
                            flex: 1,
                            paddingVertical: 25,
                            ...Theme.h5
                          }}
                        >
                          {symbol}
                        </Title>
                        <Title style={Theme.h5}>{tokens[symbol]}</Title>
                      </View>
                    </TouchableRipple>
                  ))}
                </ScrollView>
              )}
            </View>
          </Animated.View>
        </BackgroundView>
      </AndroidBackHandler>
    );
  }
}
