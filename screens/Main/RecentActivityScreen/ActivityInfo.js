import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { observable, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Text, TouchableRipple, Colors } from 'react-native-paper';
import { withNavigation } from 'react-navigation';
import moment from 'moment';
import { Svg } from 'expo';

import { ActivityEmptyState } from './ActivityEmptyState';

import { SkeletonIndicator } from '../../../components/Indicator';
import { Theme } from '../../../constants';

const ActivityIndicator = () => (
  <View
    style={{
      padding: 17,
      borderBottomWidth: 1,
      borderBottomColor: Theme.pallete.gray
    }}
  >
    <SkeletonIndicator width="100%" height={40}>
      <Svg.Rect x="0" y="0" rx="4" ry="4" width="70%" height="15" />
      <Svg.Rect x="0" y="25" rx="4" ry="4" width="100%" height="15" />
    </SkeletonIndicator>
  </View>
);

const ActivityGroupIndicator = () => (
  <View>
    <View style={{ height: 20, backgroundColor: Theme.pallete.gray }} />

    <View
      style={{
        marginTop: 15,
        marginHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: Colors.grey200
      }}
    >
      <SkeletonIndicator width="100%" height={15}>
        <Svg.Rect x="0" y="0" rx="4" ry="4" width="80" height="15" />
      </SkeletonIndicator>
    </View>

    <ActivityIndicator />
    <ActivityIndicator />
  </View>
);

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

    return <ActivityGroupIndicator />;
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
      const time = moment(action.block_time).format('YYYY-MM-DD');

      return { ...pv, [time]: pv[time] ? [...pv[time], action] : [action] };
    }, {});

    if (!fetched) {
      return (
        <View>
          <ActivityGroupIndicator />
          <ActivityGroupIndicator />
          <ActivityGroupIndicator />
        </View>
      );
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
        renderItem={({ item: key }) => (
          <View style={{ backgroundColor: '#fff' }}>
            <View style={{ height: 20, backgroundColor: Theme.pallete.gray }} />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                marginTop: 15,
                marginHorizontal: 20,
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderColor: Colors.grey200
              }}
            >
              <Text style={{ flex: 1, ...Theme.h5 }}>
                {moment(key).fromNow()}
              </Text>
              <Text style={{ color: Theme.pallete.darkGray, ...Theme.text }}>
                {moment(key).format('ll')}
              </Text>
            </View>

            <View>
              {groupedActions[key].map(
                ({ account_action_seq, action_trace, block_time }) => (
                  <TouchableRipple
                    key={account_action_seq}
                    style={{
                      padding: 17,
                      borderBottomWidth: 1,
                      borderBottomColor: Theme.pallete.gray
                    }}
                    onPress={() =>
                      this.props.navigation.navigate('ActivityDetail', {
                        actionSeq: account_action_seq
                      })
                    }
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            marginBottom: 5,
                            fontSize: 18,
                            lineHeight: 18
                          }}
                        >
                          {action_trace.act.name}
                        </Text>
                        <Text style={{ fontSize: 13 }}>
                          by {action_trace.act.account}
                        </Text>
                      </View>
                      <Text
                        style={{
                          paddingLeft: 15,
                          fontSize: 13,
                          color: Theme.pallete.darkGray
                        }}
                      >
                        {moment(block_time).format('A hh:mm')}
                      </Text>
                    </View>
                  </TouchableRipple>
                )
              )}
            </View>
          </View>
        )}
      />
    );
  }
}
