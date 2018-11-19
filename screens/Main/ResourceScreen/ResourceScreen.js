import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { View } from 'react-native';
import { Appbar, Button, Text } from 'react-native-paper';
import bytes from 'bytes';
import moment from 'moment';

import { BackgroundView } from '../../../components/View';

import { Theme } from '../../../constants';

const CIRCLE = 100;
const HIDE = 65;

const ResourceView = ({ name, description, percent, color, style }) => (
  <View
    style={{
      flex: 1,
      paddingVertical: 35,
      backgroundColor: Theme.mainBackgroundColor,
      borderRadius: Theme.innerBorderRadius,
      overflow: 'hidden',
      ...Theme.shadow,
      ...style
    }}
  >
    <View
      style={{
        marginBottom: 20,
        alignItems: 'center'
      }}
    >
      <Text style={{ marginBottom: 10, fontWeight: '500' }}>{name}</Text>

      <Text>{description}</Text>
    </View>

    <View
      style={{
        position: 'absolute',
        bottom: -HIDE,
        alignSelf: 'center',

        width: CIRCLE,
        height: CIRCLE,
        backgroundColor: 'gray',
        borderRadius: 9999,
        overflow: 'hidden'
      }}
    >
      <View
        style={{
          position: 'absolute',
          left: 0,
          bottom: HIDE - CIRCLE,
          width: CIRCLE,
          height: 2 * CIRCLE,
          transform: [{ rotate: `${180 * percent}deg` }]
        }}
      >
        <View style={{ flex: 1, backgroundColor: '#efefef' }} />
        <View style={{ flex: 1, backgroundColor: color }} />
      </View>
    </View>
  </View>
);

@inject('accountStore')
@observer
export class ResourceScreen extends Component {
  moveScreen = routeName => this.props.navigation.navigate(routeName);

  prettyBytes = num => bytes(num, { unitSeparator: ' ' }).toLowerCase();

  prettySec = microSec => {
    const ms = 1024;
    const s = ms * ms;

    if (microSec >= s) {
      return `${this.toNumWithComma((microSec / s).toFixed(2))} s`;
    }

    if (microSec >= ms) {
      return `${this.toNumWithComma((microSec / ms).toFixed(2))} ms`;
    }

    return `${this.toNumWithComma(microSec)} µs`;
  };

  // * toLocaleString() is not supported in Android
  // https://github.com/facebook/react-native/issues/15717
  toNumWithComma = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  render() {
    const {
      navigation,
      accountStore: { info }
    } = this.props;
    const { prettyBytes, prettySec } = this;

    const {
      ram_quota: maxRam = 0,
      ram_usage: usedRam = 0,
      net_limit: { max: maxNet = 0, used: usedNet = 0 } = {},
      cpu_limit: { max: maxCpu = 0, used: usedCpu = 0 } = {},
      refund_request
    } = info;

    const percentRam = usedRam / maxRam;
    const percentCpu = usedCpu / maxCpu;
    const percentNet = usedNet / maxNet;

    const requestTime = refund_request && refund_request.request_time;
    const currentTimeStamp = moment().unix();
    const requestTimeStamp = moment(requestTime).unix();
    const refundTimeStamp = moment(requestTime)
      .add(3, 'day')
      .unix();
    const percentEstimated =
      (currentTimeStamp - requestTimeStamp) /
      (refundTimeStamp - requestTimeStamp);

    return (
      <BackgroundView>
        <Appbar.Header style={{ backgroundColor: Theme.headerBackgroundColor }}>
          <Appbar.BackAction onPress={() => navigation.goBack(null)} />
          <Appbar.Content title="Resource" />
        </Appbar.Header>

        <View style={{ margin: Theme.innerSpacing }}>
          <View
            style={{ flexDirection: 'row', marginBottom: Theme.innerSpacing }}
          >
            <ResourceView
              name="CPU"
              description={`${prettySec(usedCpu)} / ${prettySec(maxCpu)}`}
              percent={percentCpu}
              color={Theme.quaternary}
              style={{ marginRight: Theme.innerSpacing }}
            />
            <ResourceView
              name="Network"
              description={`${prettyBytes(usedNet)} / ${prettyBytes(maxNet)}`}
              percent={percentNet}
              color={Theme.tertiary}
            />
          </View>

          <View style={{ flexDirection: 'row' }}>
            <ResourceView
              name="Ram"
              description={`${prettyBytes(usedRam)} / ${prettyBytes(maxRam)}`}
              percent={percentRam}
              color={Theme.secondary}
              style={{ marginRight: Theme.innerSpacing }}
            />
            <ResourceView
              name="Refund"
              description={
                requestTime
                  ? moment.unix(refundTimeStamp).fromNow()
                  : 'No refund yet'
              }
              percent={requestTime ? percentEstimated : 0}
              color={Theme.primary}
            />
          </View>
        </View>

        <Button
          mode="contained"
          style={{ margin: Theme.innerSpacing, padding: 5 }}
          onPress={() => this.moveScreen('ManageResource')}
        >
          Manage Resource
        </Button>
      </BackgroundView>
    );
  }
}
