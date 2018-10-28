import React, { Component } from 'react';
import { withNavigation } from 'react-navigation';
import { Button } from 'react-native-paper';

import { EmptyState } from '../../../components/EmptyState';

@withNavigation
export class AccountEmptyState extends Component {
  render() {
    return (
      <EmptyState
        image={require('../../../assets/example.png')}
        title="No account imported yet"
        description="When you import account, you can transfer tokens, stake/unstake and sign transaction."
      >
        <Button
          icon="add"
          mode="outlined"
          onPress={() => this.props.navigation.navigate('ImportAccount')}
        >
          Import Account
        </Button>
      </EmptyState>
    );
  }
}
