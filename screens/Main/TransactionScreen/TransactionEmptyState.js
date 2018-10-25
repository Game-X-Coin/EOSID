import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';

import { EmptyState } from '../../../components/EmptyState';
import { Button } from 'react-native-paper';

@inject('accountStore')
@observer
export class TransactionEmptyState extends Component {
  @observable
  refreshing = false;

  onRefresh = async () => {
    this.refreshing = true;

    await this.props.accountStore.getActions();

    this.refreshing = false;
  };

  render() {
    return (
      <EmptyState
        image={require('../../../assets/example.png')}
        title="No transactions yet"
        description="Looks like you have not done anything yet, If not, please press the refresh button."
      >
        <Button
          icon="refresh"
          mode="outlined"
          loading={this.refreshing}
          onPress={this.onRefresh}
        >
          Refresh
        </Button>
      </EmptyState>
    );
  }
}
