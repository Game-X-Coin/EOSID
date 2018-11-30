import React, { Component } from 'react';
import { View } from 'react-native';
import { Appbar } from 'react-native-paper';

import { EmptyState } from '../../../components/EmptyState';
import { Theme } from '../../../constants';

export class ShowSuccessScreen extends Component {
  render() {
    const { navigation } = this.props;
    const { title, description, onPress = () => navigation.goBack() } =
      navigation.state.params || {};

    return (
      <View style={{ flex: 1 }}>
        <Appbar.Header
          dark
          style={{
            justifyContent: 'flex-end',
            backgroundColor: Theme.header.backgroundColor
          }}
        >
          <Appbar.Action icon="close" onPress={onPress} />
        </Appbar.Header>

        <EmptyState
          dark
          image={require('../../../assets/images/success.png')}
          title={title}
          description={description}
        />
      </View>
    );
  }
}
