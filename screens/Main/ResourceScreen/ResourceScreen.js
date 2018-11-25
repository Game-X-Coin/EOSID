import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import moment from 'moment';

import { BackgroundView } from '../../../components/View';

import { Theme } from '../../../constants';
import { ResourceView } from '../ManageResourceScreen/ResourceView';

@inject('accountStore')
@observer
export class ResourceScreen extends Component {
  moveScreen = (...args) => this.props.navigation.navigate(...args);

  render() {
    const {
      navigation,
      accountStore: { info }
    } = this.props;

    const { refund_request } = info;

    const requestTime = refund_request && refund_request.request_time;
    const refundTime = moment(requestTime).add(3, 'day');
    const refundAmount =
      refund_request &&
      parseFloat(refund_request.cpu_amount) +
        parseFloat(refund_request.net_amount);

    return (
      <BackgroundView>
        <Appbar.Header style={{ backgroundColor: Theme.headerBackgroundColor }}>
          <Appbar.BackAction onPress={() => navigation.goBack(null)} />
          <Appbar.Content title="Resource" />
        </Appbar.Header>

        <View style={{ margin: Theme.innerSpacing }}>
          <ResourceView
            type="CPU"
            onPress={() =>
              this.moveScreen('ManageResource', { resourceName: 'CPU' })
            }
          />
          <ResourceView
            type="Network"
            onPress={() =>
              this.moveScreen('ManageResource', { resourceName: 'Network' })
            }
          />
          <ResourceView type="RAM" />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 15,
              backgroundColor: Theme.mainBackgroundColor,
              borderRadius: Theme.innerBorderRadius,
              ...Theme.shadow
            }}
          >
            <Text style={{ flex: 1 }}>Refunding</Text>

            {refund_request ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: Theme.primary }}>
                  {moment(refundTime).fromNow()}
                </Text>
                <Text> / {refundAmount.toFixed(4)} EOS</Text>
              </View>
            ) : (
              <Text>No refund yet</Text>
            )}
          </View>
        </View>
      </BackgroundView>
    );
  }
}
