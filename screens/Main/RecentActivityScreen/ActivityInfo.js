import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { observable, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Text, TouchableRipple } from 'react-native-paper';
import { withNavigation } from 'react-navigation';
import moment from 'moment';
import { Svg } from 'expo';

import { ActivityEmptyState } from './ActivityEmptyState';

import { SkeletonIndicator } from '../../../components/Indicator';
import { Theme } from '../../../constants';
import { Title } from 'react-native-paper';

const ActivityIndicator = () => (
  <View
    style={{
      padding: 17,
      borderBottomWidth: 1,
      borderBottomColor: '#d6d6d6'
    }}
  >
    <SkeletonIndicator width="100%" height={40}>
      <Svg.Rect x="0" y="0" rx="4" ry="4" width="100%" height="15" />
      <Svg.Rect x="0" y="25" rx="4" ry="4" width="50%" height="15" />
    </SkeletonIndicator>
  </View>
);

const ActivityGroupIndicator = () => (
  <View style={{ margin: Theme.innerSpacing }}>
    <SkeletonIndicator width="100%" height={30}>
      <Svg.Rect x="15" y="0" rx="4" ry="4" width="100" height="15" />
    </SkeletonIndicator>
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: Theme.innerBorderRadius,
        ...Theme.shadow
      }}
    >
      <ActivityIndicator />
      <ActivityIndicator />
    </View>
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
          <View
            style={{
              marginHorizontal: Theme.innerSpacing,
              marginVertical: Theme.innerSpacing
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 10,
                marginBottom: 10
              }}
            >
              <Text style={{ flex: 1, fontSize: 15 }}>
                {moment(key).fromNow()}
              </Text>
              <Text style={{ color: Theme.infoColor }}>
                {moment(key).format('ll')}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: Theme.innerBorderRadius,
                overflow: 'hidden',
                ...Theme.shadow
              }}
            >
              {groupedActions[key].map(
                ({ account_action_seq, action_trace, block_time }) => (
                  <TouchableRipple
                    key={account_action_seq}
                    style={{
                      padding: 17,
                      borderBottomWidth: 1,
                      borderBottomColor: '#d6d6d6'
                    }}
                    onPress={() =>
                      this.props.navigation.navigate('ActivityDetail', {
                        actionSeq: account_action_seq
                      })
                    }
                  >
                    <View
                      style={{
                        flexDirection: 'row'
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Title
                          style={{
                            marginBottom: 5,
                            fontSize: 18,
                            lineHeight: 18
                          }}
                        >
                          {action_trace.act.name}
                        </Title>
                        <Text style={{ fontSize: 13 }}>
                          by {action_trace.act.account}
                        </Text>
                      </View>
                      <Text
                        style={{
                          paddingLeft: 15,
                          fontSize: 13,
                          color: Theme.infoColor
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
