import React, { Component } from 'react';
import { View } from 'react-native';
import { Text, Appbar } from 'react-native-paper';

import { EmptyState } from '../../../components/EmptyState';
import { Theme } from '../../../constants';

export class ShowErrorScreen extends Component {
  render() {
    const { navigation } = this.props;
    const { title, description, error, onPress = () => navigation.goBack() } =
      navigation.state.params || {};

    return (
      <View style={{ flex: 1 }}>
        <Appbar.Header
          style={{
            justifyContent: 'flex-end',
            backgroundColor: Theme.header.backgroundColor
          }}
        >
          <Appbar.Action icon="close" onPress={onPress} />
        </Appbar.Header>

        <EmptyState
          image={require('../../../assets/images/error.png')}
          title={title}
          description={description}
          descriptionStyle={{ marginBottom: 20 }}
        >
          <View
            style={{
              marginBottom: 35,
              padding: 15,
              width: '80%',
              backgroundColor: Theme.palette.gray,
              borderRadius: 5
            }}
          >
            <Text>{error}</Text>
          </View>
        </EmptyState>
      </View>
    );
  }
}
