import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import moment from '../../../utils/moment';

import { BackgroundView, ScrollView } from '../../../components/View';
import { Theme } from '../../../constants';
import EosApi from '../../../utils/eos/API';
import { PageIndicator } from '../../../components/Indicator';

@inject('accountStore')
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
      accountStore: { currentAccount }
    } = this.props;
    const { params } = navigation.state || {};

    const { actions = [] } = await EosApi.actions.get({
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
      <View style={{ padding: 17 }}>
        <Text style={{ marginBottom: 7, ...Theme.text, fontWeight: '500' }}>
          {title}
        </Text>
        <Text style={Theme.h5}>{description}</Text>
      </View>
    );

    return (
      <BackgroundView>
        <Appbar.Header
          style={{ backgroundColor: Theme.header.backgroundColor }}
        >
          <Appbar.BackAction onPress={() => navigation.goBack(null)} />
          <Appbar.Content title="Activity Detail" />
        </Appbar.Header>

        {!fetched ? (
          <PageIndicator />
        ) : (
          <ScrollView>
            <View style={{ height: 20, backgroundColor: Theme.palette.gray }} />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 17
              }}
            >
              <View
                style={{
                  flex: 1
                }}
              >
                <Text
                  style={{
                    marginBottom: 5,
                    fontSize: 18,
                    lineHeight: 18
                  }}
                >
                  {act.name}
                </Text>
                <Text style={{ fontSize: 13 }}>by {act.account}</Text>
              </View>

              <View>
                <Text style={{ fontSize: 13, color: Theme.palette.darkGray }}>
                  {moment(block_time).format('lll')}
                </Text>
              </View>
            </View>

            <View style={{ height: 20, backgroundColor: Theme.palette.gray }} />

            {Object.keys(act.data).map(key => {
              const data = act.data[key];
              const description =
                data.constructor === Array ? JSON.stringify(data) : data;

              return <Item key={key} title={key} description={description} />;
            })}
          </ScrollView>
        )}
      </BackgroundView>
    );
  }
}
