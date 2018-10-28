import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Text, Caption, List } from 'react-native-paper';
import { withNavigation } from 'react-navigation';
import moment from 'moment';

import { ScrollView } from '../../../components/View';
import { TransactionEmptyState } from './TransactionEmptyState';

import { PageIndicator } from '../../../components/Indicator';

@withNavigation
@inject('accountStore')
@observer
export class TransactionInfo extends Component {
  @observable
  refreshing = false;

  onRefresh = async () => {
    this.refreshing = true;

    await this.props.accountStore.getActions();

    this.refreshing = false;
  };

  render() {
    const { actions, fetched } = this.props.accountStore;

    if (!fetched) {
      return <PageIndicator />;
    }

    if (!actions.length) {
      return <TransactionEmptyState />;
    }

    return (
      <ScrollView refreshing={this.refreshing} onRefresh={this.onRefresh}>
        <List.Section title="Lastest">
          {actions.map(({ block_time, action_trace }, i) => (
            <List.Item
              key={i}
              title={action_trace.act.name}
              description={action_trace.act.account}
              right={() => (
                <Caption style={{ alignSelf: 'center' }}>
                  {moment(block_time).fromNow()}
                </Caption>
              )}
              onPress={() =>
                this.props.navigation.navigate('TransactionDetail', {
                  txId: action_trace.trx_id
                })
              }
            />
          ))}
        </List.Section>
      </ScrollView>
    );
  }
}
