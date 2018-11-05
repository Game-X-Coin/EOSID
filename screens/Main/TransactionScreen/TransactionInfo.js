import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { observable, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Caption, List } from 'react-native-paper';
import { withNavigation } from 'react-navigation';
import moment from 'moment';

import { TransactionEmptyState } from './TransactionEmptyState';

import { PageIndicator, Indicator } from '../../../components/Indicator';

@withNavigation
@inject('accountStore')
@observer
export class TransactionInfo extends Component {
  @observable
  page = 1;

  @observable
  offset = 10;

  @observable
  refreshing = false;

  @observable
  loading = false;

  @computed
  get fetchable() {
    return this.props.accountStore.lastestActionSeq > this.page * this.offset;
  }

  onRefresh = async () => {
    if (this.loading) {
      return;
    }

    this.refreshing = true;

    // reset page
    this.page = 1;

    await this.props.accountStore.getActions(this.page);

    this.refreshing = false;
  };

  onEndReached = async () => {
    if (this.loading || !this.fetchable) {
      return;
    }

    this.loading = true;

    // increase page
    this.page += 1;

    await this.props.accountStore.getActions(this.page);

    this.loading = false;
  };

  renderFooter = () => {
    if (!this.fetchable) {
      return null;
    }

    return (
      <View style={{ paddingVertical: 20 }}>
        <Indicator />
      </View>
    );
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
      <FlatList
        keyExtractor={item => `${item.global_action_seq}`}
        data={actions}
        onEndReachedThreshold={0.5}
        refreshing={this.refreshing}
        onRefresh={this.onRefresh}
        onEndReached={this.onEndReached}
        ListFooterComponent={this.renderFooter}
        renderItem={({
          item: { block_time, action_trace, global_action_seq }
        }) => (
          <List.Item
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
        )}
      />
    );
  }
}
