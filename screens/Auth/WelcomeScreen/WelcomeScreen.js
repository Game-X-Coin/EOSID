import React, { Component } from 'react';
import { Animated } from 'react-native';
import { observer, inject } from 'mobx-react';
import { View, Image, Dimensions, Platform, StatusBar } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Swiper from 'react-native-swiper';

import { BackgroundView } from '../../../components/View';
import { DarkTheme, Theme } from '../../../constants';

const { width } = Dimensions.get('window');

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;
const IMAGE_WIDTH = width - 80;
const IMAGE_HEIGHT = IMAGE_WIDTH * 1.88;

const contentStyle = {
  container: {
    flex: 1,
    marginTop: STATUS_BAR_HEIGHT,
    alignItems: 'center'
  },

  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    borderRadius: 5
  },

  textArea: {
    alignItems: 'center',
    marginTop: 70,
    marginBottom: 40
  },

  title: {
    ...DarkTheme.h1,
    marginBottom: 20
  },

  description: {
    ...DarkTheme.h5,
    width: 250,
    textAlign: 'center',
    fontWeight: '300'
  }
};

const Balance = () => (
  <View style={contentStyle.container}>
    <View style={contentStyle.textArea}>
      <Text style={contentStyle.title}>Balance</Text>
      <Text style={contentStyle.description}>
        Check your balance and manage your assets easily
      </Text>
    </View>

    <Image
      resizeMode="contain"
      style={contentStyle.image}
      source={require('../../../assets/images/started_balance.png')}
    />
  </View>
);

const Resources = () => (
  <View style={contentStyle.container}>
    <View style={contentStyle.textArea}>
      <Text style={contentStyle.title}>Resources</Text>
      <Text style={contentStyle.description}>
        Check status for resources and refunding progress
      </Text>
    </View>

    <Image
      resizeMode="contain"
      style={contentStyle.image}
      source={require('../../../assets/images/started_resources.png')}
    />
  </View>
);

const Activities = () => (
  <View style={contentStyle.container}>
    <View style={contentStyle.textArea}>
      <Text style={contentStyle.title}>Activities</Text>
      <Text style={contentStyle.description}>
        View historic actions including transfer and receive
      </Text>
    </View>

    <Image
      style={contentStyle.image}
      source={require('../../../assets/images/started_activities.png')}
      resizeMode="contain"
    />
  </View>
);

@inject('settingsStore')
@observer
export class WelcomeScreen extends Component {
  visible = new Animated.Value(0);

  onIndexChanged(i) {
    Animated.timing(this.visible, {
      toValue: i === 2 ? 1 : 0,
      duration: 200
    }).start();
  }

  async start() {
    const { navigation, settingsStore } = this.props;

    await settingsStore.initializeSettings();
    navigation.navigate('Account');
  }

  render() {
    return (
      <BackgroundView style={{ backgroundColor: '#242424' }}>
        <Swiper
          loop={false}
          containerStyle={{ flex: 1 }}
          renderPagination={(pageIndex, total) => (
            <View
              style={{
                flexDirection: 'row',
                position: 'absolute',
                top: STATUS_BAR_HEIGHT + 30,
                left: 0,
                right: 0,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {Array.from({ length: total }, (v, i) => {
                const active = i === pageIndex;

                return (
                  <View
                    key={i}
                    style={{
                      borderRadius: 10,
                      marginLeft: 7,
                      marginRight: 7,

                      ...(active
                        ? {
                            backgroundColor: '#fff',
                            width: 8,
                            height: 8
                          }
                        : {
                            backgroundColor: 'rgba(255,255,255,.3)',
                            width: 7,
                            height: 7
                          })
                    }}
                  />
                );
              })}
            </View>
          )}
          onIndexChanged={i => this.onIndexChanged(i)}
        >
          <Balance />
          <Resources />
          <Activities />
        </Swiper>

        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: this.visible.interpolate({
              inputRange: [0, 1],
              outputRange: [-100, 0]
            }),
            borderTopColor: Theme.palette.gray,
            borderTopWidth: 1,
            opacity: this.visible
          }}
        >
          <Button
            mode="contained"
            color="#fff"
            onPress={() => this.start()}
            style={{ padding: 10, borderRadius: 0 }}
          >
            Get Started
          </Button>
        </Animated.View>
      </BackgroundView>
    );
  }
}
