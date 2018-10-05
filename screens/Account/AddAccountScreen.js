import React, { Component } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Appbar, List } from 'react-native-paper';
import { TextField } from 'react-native-material-textfield';

import HomeStyle from '../../styles/HomeStyle';

class AddAccountScreen extends Component {
  static navigationOptions = {
    header: null
  };

  render() {
    const { navigation } = this.props;

    return (
      <View style={HomeStyle.container}>
        <SafeAreaView>
          <Appbar.Header>
            <Appbar.Content title={'Account'} subtitle={'add account'} />
            <Appbar.BackAction onPress={() => navigation.goBack(null)} />
          </Appbar.Header>
          <TextField
            multiline
            label="Private key"
            style={{ fontFamily: 'monospace' }}
          />
          <ScrollView
            style={HomeStyle.container}
            contentContainerStyle={HomeStyle.contentContainer}
          >
            <View style={HomeStyle.welcomeContainer}>
              <Text>Add Account</Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

export default withNavigation(AddAccountScreen);
