import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { View } from 'react-native';
import { Appbar, Text, Title } from 'react-native-paper';
import moment from 'moment';
import { Svg } from 'expo';

import { SkeletonIndicator } from '../../../components/Indicator';
import { BackgroundView, ScrollView } from '../../../components/View';
import { Theme } from '../../../constants';

const ActivityIndicator = () => (
  <View
    style={{
      margin: Theme.innerSpacing,
      padding: Theme.innerPadding,
      backgroundColor: Theme.mainBackgroundColor,
      borderRadius: Theme.innerBorderRadius,
      ...Theme.shadow
    }}
  >
    <SkeletonIndicator width="100%" height={40}>
      <Svg.Rect x="0" y="0" rx="4" ry="4" width="70%" height="15" />
      <Svg.Rect x="0" y="25" rx="4" ry="4" width="35%" height="15" />
    </SkeletonIndicator>

    <View
      style={{
        marginVertical: 20,
        height: 1,
        backgroundColor: '#d6d6d6'
      }}
    />

    <SkeletonIndicator width="100%" height={60}>
      <Svg.Rect x="0" y="0" rx="4" ry="4" width="30%" height="15" />
      <Svg.Rect x="0" y="25" rx="4" ry="4" width="50%" height="15" />
    </SkeletonIndicator>

    <SkeletonIndicator width="100%" height={60}>
      <Svg.Rect x="0" y="0" rx="4" ry="4" width="30%" height="15" />
      <Svg.Rect x="0" y="25" rx="4" ry="4" width="50%" height="15" />
    </SkeletonIndicator>

    <SkeletonIndicator width="100%" height={40}>
      <Svg.Rect x="0" y="0" rx="4" ry="4" width="30%" height="15" />
      <Svg.Rect x="0" y="25" rx="4" ry="4" width="50%" height="15" />
    </SkeletonIndicator>
  </View>
);

@inject('accountStore', 'networkStore')
@observer
export class ActivityDetailScreen extends Component {
  constructor() {
    super();

    this.state = {
      fetched: false,
      info: {}
    };
  }

  async componentDidMount() {
    const {
      navigation,
      networkStore: { eos },
      accountStore: { currentAccount }
    } = this.props;
    const { params } = navigation.state || {};

    const { actions = [] } = await eos.actions.get({
      pos: params.actionSeq,
      account_name: currentAccount.name
    });

    this.setState({ fetched: true, info: actions.length ? actions[0] : {} });
  }

  render() {
    const { navigation } = this.props;
    const {
      fetched,
      info: { action_trace: { block_time, act } = {} }
    } = this.state;

    const Item = ({ title, description }) => (
      <View style={{ marginTop: 20 }}>
        <Text style={{ marginBottom: 7, fontSize: 16, fontWeight: '500' }}>
          {title}
        </Text>
        <Text style={{ fontSize: 16 }}>{description}</Text>
      </View>
    );

    return (
      <BackgroundView>
        <Appbar.Header style={{ backgroundColor: Theme.headerBackgroundColor }}>
          <Appbar.BackAction onPress={() => navigation.goBack(null)} />
          <Appbar.Content title="Activity Detail" />
        </Appbar.Header>

        {!fetched ? (
          <ActivityIndicator />
        ) : (
          <ScrollView style={{ margin: Theme.innerSpacing }}>
            <View
              style={{
                padding: Theme.innerPadding,
                borderRadius: Theme.innerBorderRadius,
                backgroundColor: Theme.mainBackgroundColor,
                ...Theme.shadow
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 20
                }}
              >
                <View
                  style={{
                    flex: 1
                  }}
                >
                  <Title style={{ marginBottom: 5, lineHeight: 20 }}>
                    {act.name}
                  </Title>
                  <Text style={{ fontSize: 13 }}>by {act.account}</Text>
                </View>

                <View>
                  <Text style={{ fontSize: 14 }}>
                    {moment(block_time).format('lll')}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  height: 1,
                  backgroundColor: '#d6d6d6'
                }}
              />

              {Object.keys(act.data).map(key => {
                const data = act.data[key];
                const description =
                  data.constructor === Array ? JSON.stringify(data) : data;

                return <Item key={key} title={key} description={description} />;
              })}
            </View>
          </ScrollView>
        )}
      </BackgroundView>
    );
  }
}
