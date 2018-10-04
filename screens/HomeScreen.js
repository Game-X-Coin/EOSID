import React, { Component } from 'react';
import { ScrollView, Text, View } from 'react-native';

import HomeStyle from '../styles/HomeStyle';

export default class HomeScreen extends Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <View style={HomeStyle.container}>
        <ScrollView
          style={HomeStyle.container}
          contentContainerStyle={HomeStyle.contentContainer}
        >
          <View style={HomeStyle.welcomeContainer}>
            <Text>Home</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}
