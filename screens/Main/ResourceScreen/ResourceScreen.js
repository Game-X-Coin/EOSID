import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { View, Image } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import moment from '../../../utils/moment';

import { BackgroundView } from '../../../components/View';

import { Theme } from '../../../constants';
import { ResourceView } from '../ManageResourceScreen/ResourceView';
import { PageIndicator } from '../../../components/Indicator';

@inject('accountStore')
@observer
export class ResourceScreen extends Component {
  moveScreen = (...args) => this.props.navigation.navigate(...args);

  render() {
    const {
      navigation,
      accountStore: { info, fetched }
    } = this.props;

    const { refund_request } = info;

    const requestTime = refund_request && refund_request.request_time;
    const refundTime = moment(new Date(requestTime)).add(3, 'day');
    const refundAmount =
      refund_request &&
      parseFloat(refund_request.cpu_amount) +
        parseFloat(refund_request.net_amount);

    return (
      <BackgroundView>
        <Appbar.Header
          style={{ backgroundColor: Theme.header.backgroundColor }}
        >
          <Appbar.BackAction onPress={() => navigation.goBack(null)} />
          <Appbar.Content title="Resources" />
        </Appbar.Header>

        {!fetched ? (
          <PageIndicator />
        ) : (
          <View>
            <View style={{ height: 20, backgroundColor: Theme.palette.gray }} />

            <ResourceView
              type="CPU"
              onPress={() =>
                this.moveScreen('ManageResource', { resourceName: 'CPU' })
              }
            />
            <View style={{ height: 20, backgroundColor: Theme.palette.gray }} />

            <ResourceView
              type="Network"
              onPress={() =>
                this.moveScreen('ManageResource', { resourceName: 'Network' })
              }
            />
            <View style={{ height: 20, backgroundColor: Theme.palette.gray }} />

            <ResourceView type="RAM" />
            <View style={{ height: 20, backgroundColor: Theme.palette.gray }} />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 20
              }}
            >
              <View
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
              >
                <Image
                  resizeMode="contain"
                  style={{ width: 20, height: 20, marginRight: 10 }}
                  source={require('../../../assets/icons/refund.png')}
                />
                <Text>Refunding</Text>
              </View>

              {refund_request ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text>
                    {moment(refundTime).fromNow()} / {refundAmount.toFixed(4)}{' '}
                    EOS
                  </Text>
                </View>
              ) : (
                <Text>No refund yet</Text>
              )}
            </View>
          </View>
        )}
      </BackgroundView>
    );
  }
}
