import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { observable, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Caption, List, Text, TouchableRipple } from 'react-native-paper';
import { withNavigation } from 'react-navigation';
import moment from 'moment';

import { ActivityEmptyState } from './ActivityEmptyState';

import { PageIndicator, Indicator } from '../../../components/Indicator';

@withNavigation
@inject('accountStore')
@observer
export class ActivityInfo extends Component {
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

    /** example
     *  {
     *    2018-10-11: [
     *       ...actions.
     *    ],
     *  };
     */
    const groupedActions = actions.reduce((pv, action) => {
      const time = moment(action.block_time).format('MM/DD');

      return { ...pv, [time]: pv[time] ? [...pv[time], action] : [action] };
    }, {});

    if (!fetched) {
      return <PageIndicator />;
    }

    if (!actions.length) {
      return <ActivityEmptyState />;
    }

    return (
      <FlatList
        keyExtractor={time => time}
        data={Object.keys(groupedActions)}
        onEndReachedThreshold={0.5}
        refreshing={this.refreshing}
        onRefresh={this.onRefresh}
        onEndReached={this.onEndReached}
        ListFooterComponent={this.renderFooter}
        renderItem={({ item: time }) => (
          <List.Section title={time}>
            {groupedActions[time].map(
              ({ account_action_seq, action_trace, block_time }) => (
                <TouchableRipple
                  key={account_action_seq}
                  style={{ paddingHorizontal: 15, paddingVertical: 10 }}
                  onPress={() =>
                    this.props.navigation.navigate('ActivityDetail', {
                      actionSeq: account_action_seq
                    })
                  }
                >
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ marginRight: 7, fontSize: 17 }}>
                          {action_trace.act.name}
                        </Text>
                        <Caption>{action_trace.act.account}</Caption>
                      </View>

                      <Caption numberOfLines={2}>
                        {JSON.stringify(action_trace.act.data)}
                      </Caption>
                    </View>
                    <Text
                      style={{
                        alignSelf: 'center',
                        paddingLeft: 15,
                        fontSize: 13
                      }}
                    >
                      {moment(block_time).format('hh:mm')}
                    </Text>
                  </View>
                </TouchableRipple>
              )
            )}
          </List.Section>
        )}
      />
    );
  }
}
