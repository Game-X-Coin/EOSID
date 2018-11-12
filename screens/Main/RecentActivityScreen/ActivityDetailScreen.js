import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { View } from 'react-native';
import { Appbar, Divider, Caption, Text, Title } from 'react-native-paper';
import moment from 'moment';

import { PageIndicator } from '../../../components/Indicator';
import { BackgroundView, ScrollView } from '../../../components/View';
import { Theme } from '../../../constants';

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
      info: { action_trace: { trx_id, block_time, act } = {} }
    } = this.state;

    const Item = ({ title, description, children }) => (
      <View style={{ marginTop: 5, marginBottom: 5 }}>
        <Caption>{title}</Caption>
        {description && <Text>{description}</Text>}
        {children}
      </View>
    );

    return (
      <BackgroundView>
        <Appbar.Header style={{ backgroundColor: Theme.headerBackgroundColor }}>
          <Appbar.BackAction onPress={() => navigation.goBack(null)} />
          <Appbar.Content title="Activity Detail" />
        </Appbar.Header>

        {!fetched ? (
          <PageIndicator />
        ) : (
          <ScrollView style={{ padding: Theme.innerPadding }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                marginBottom: 15
              }}
            >
              <Title style={{ marginRight: 10, fontSize: 25 }}>
                {act.name}
              </Title>
              <Caption style={{ lineHeight: 25, fontSize: 15 }}>
                by {act.account}
              </Caption>
            </View>

            <Text>
              {moment(block_time).format('lll')} ({moment(block_time).fromNow()}
              )
            </Text>

            <View
              style={{
                padding: 20,
                marginTop: Theme.innerSpacing,
                borderRadius: Theme.innerBorderRadius,
                backgroundColor: Theme.mainBackgroundColor,
                ...Theme.shadow
              }}
            >
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
