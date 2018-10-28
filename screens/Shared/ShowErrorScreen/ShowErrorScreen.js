import React, { Component } from 'react';
import { View } from 'react-native';
import { Colors, Text, Button } from 'react-native-paper';

import { EmptyState } from '../../../components/EmptyState';
import { ScrollView } from '../../../components/View';

export class ShowErrorScreen extends Component {
  render() {
    const {
      title,
      description,
      error,
      onPress = () => this.props.navigation.navigate('Account')
    } = this.props.navigation.state.params || {};

    return (
      <EmptyState
        image={require('../../../assets/example.png')}
        title={title}
        description={description}
        descriptionStyle={{ marginBottom: 20 }}
      >
        <View
          style={{
            alignSelf: 'stretch',
            marginBottom: 25,
            marginHorizontal: 30,
            height: 150,
            backgroundColor: Colors.grey300,
            borderRadius: 5
          }}
        >
          <ScrollView style={{ padding: 10 }}>
            <Text style={{ color: Colors.grey700 }}>
              {JSON.stringify(error)}
            </Text>
          </ScrollView>
        </View>

        <Button mode="outlined" onPress={() => onPress()}>
          Confirm
        </Button>
      </EmptyState>
    );
  }
}
