import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { View, Image, Dimensions } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Swiper from 'react-native-swiper';

import { BackgroundView } from '../../../components/View';
import { DarkTheme } from '../../../constants';

const { height } = Dimensions.get('window');

const contentStyle = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  image: {
    height: height - 250,
    borderRadius: 10
  },

  textArea: {
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 15
  }
};

const Wallet = () => (
  <View style={contentStyle.container}>
    <Image
      style={contentStyle.image}
      source={require('../../../assets/images/started_wallet.png')}
      resizeMode="contain"
    />

    <View style={contentStyle.textArea}>
      <Text style={DarkTheme.h4}>View and manage</Text>
      <Text style={DarkTheme.h4}>all your tokens at once.</Text>
    </View>
  </View>
);

const Resources = () => (
  <View style={contentStyle.container}>
    <Image
      style={contentStyle.image}
      source={require('../../../assets/images/started_resources.png')}
      resizeMode="contain"
    />

    <View style={contentStyle.textArea}>
      <Text style={DarkTheme.h4}>View and manage</Text>
      <Text style={DarkTheme.h4}>all your resources at once.</Text>
    </View>
  </View>
);

const Activities = () => (
  <View style={contentStyle.container}>
    <Image
      style={contentStyle.image}
      source={require('../../../assets/images/started_activities.png')}
      resizeMode="contain"
    />

    <View style={contentStyle.textArea}>
      <Text style={DarkTheme.h4}>Check out all your activities.</Text>
    </View>
  </View>
);

@inject('settingsStore')
@observer
export class WelcomeScreen extends Component {
  async start() {
    const { navigation, settingsStore } = this.props;

    await settingsStore.initializeSettings();
    navigation.navigate('Account');
  }

  render() {
    return (
      <BackgroundView style={{ backgroundColor: '#242424' }}>
        <Swiper
          style={{ flex: 1 }}
          dot={
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,.3)',
                width: 10,
                height: 10,
                borderRadius: 10,
                marginLeft: 7,
                marginRight: 7
              }}
            />
          }
          activeDot={
            <View
              style={{
                backgroundColor: '#fff',
                width: 12,
                height: 12,
                borderRadius: 7,
                marginLeft: 7,
                marginRight: 7
              }}
            />
          }
          paginationStyle={{
            bottom: 30
          }}
          loop={false}
        >
          <Wallet />
          <Resources />
          <Activities />
        </Swiper>

        <Button
          mode="contained"
          color="#fff"
          onPress={() => this.start()}
          style={{ padding: 5, borderRadius: 0 }}
        >
          Get Started
        </Button>
      </BackgroundView>
    );
  }
}
