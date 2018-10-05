import React, { Component } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Appbar, List } from 'react-native-paper';

import HomeStyle from '../styles/HomeStyle';

export default class NetworkScreen extends Component {
  render() {
    return (
      <View style={HomeStyle.container}>
        <SafeAreaView>
          <Appbar.Header>
            <Appbar.Content title={'Network'} subtitle={'Network'} />
          </Appbar.Header>
          <ScrollView
            style={HomeStyle.container}
            contentContainerStyle={HomeStyle.contentContainer}
          >
            <View style={HomeStyle.welcomeContainer}>
              <Text>Network</Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
