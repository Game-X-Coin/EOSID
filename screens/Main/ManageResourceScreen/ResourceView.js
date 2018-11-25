import React, { Component, PureComponent } from 'react';
import { observer, inject } from 'mobx-react';
import { View, Animated } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import bytes from 'bytes';
import { Svg } from 'expo';

import { Theme } from '../../../constants';
import { SkeletonIndicator } from '../../../components/Indicator';

// * toLocaleString() is not supported in Android
// https://github.com/facebook/react-native/issues/15717
const toNumWithComma = num =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const prettyBytes = num => bytes(num, { unitSeparator: ' ' }).toLowerCase();

const prettySec = microSec => {
  const ms = 1024;
  const s = ms * ms;

  if (microSec >= s) {
    return `${toNumWithComma((microSec / s).toFixed(2))} s`;
  }

  if (microSec >= ms) {
    return `${toNumWithComma((microSec / ms).toFixed(2))} ms`;
  }

  return `${toNumWithComma(microSec)} µs`;
};

const ResourceIndicator = () => (
  <View
    style={{
      flexDirection: 'row',
      marginVertical: 12.5
    }}
  >
    <View style={{ flex: 1, marginRight: 30 }}>
      <SkeletonIndicator width="100%" height={100}>
        <Svg.Rect x="0" y="15" rx="4" ry="4" width="30%" height="15" />
        <Svg.Rect x="0" y="60" rx="4" ry="4" width="100%" height="25" />
      </SkeletonIndicator>
    </View>

    <SkeletonIndicator width={100} height={100}>
      <Svg.Circle cx="50" cy="50" r="50" />
    </SkeletonIndicator>
  </View>
);

class Resource extends PureComponent {
  state = {
    frame: new Animated.Value(0)
  };

  componentDidUpdate() {
    Animated.timing(this.state.frame, {
      toValue: this.props.percent,
      duration: 1000
    }).start();
  }

  componentDidMount() {
    Animated.timing(this.state.frame, {
      toValue: this.props.percent,
      duration: 1000
    }).start();
  }

  render() {
    const { name, description, percent, color, style, onPress } = this.props;
    const { frame } = this.state;

    return (
      <View
        style={{
          borderRadius: Theme.innerBorderRadius,
          overflow: 'hidden',
          ...style
        }}
      >
        <TouchableRipple
          style={{
            paddingVertical: 15,
            paddingHorizontal: 20,
            backgroundColor: Theme.mainBackgroundColor
          }}
          onPress={onPress}
        >
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ marginBottom: 25 }}>{name}</Text>

              <Text style={{ marginBottom: 3, fontSize: 25 }}>
                {description}
              </Text>
              <Text style={{ fontSize: 15 }}>{percent}% left</Text>
            </View>

            <View
              style={{
                position: 'relative',
                width: 100,
                height: 100,
                borderRadius: 99999,
                overflow: 'hidden'
              }}
            >
              <Animated.View
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: frame.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%']
                  }),
                  backgroundColor: color
                }}
              />
            </View>
          </View>
        </TouchableRipple>
      </View>
    );
  }
}

@inject('accountStore')
@observer
export class ResourceView extends Component {
  render() {
    const {
      accountStore: { info, fetched },
      type,
      onPress
    } = this.props;

    const {
      cpu_limit: { max: maxCpu = 0, used: usedCpu = 0 } = {},
      net_limit: { max: maxNet = 0, used: usedNet = 0 } = {},
      ram_quota: maxRam = 0,
      ram_usage: usedRam = 0
    } = info;

    const percentCpu = (((maxCpu - usedCpu) / maxCpu) * 100).toFixed(0);
    const percentNet = (((maxNet - usedNet) / maxNet) * 100).toFixed(0);
    const percentRam = (((maxRam - usedRam) / maxRam) * 100).toFixed(0);

    const resourceTypes = {
      CPU: (
        <Resource
          name="CPU"
          description={`${prettySec(usedCpu)} / ${prettySec(maxCpu)}`}
          percent={percentCpu}
          color={Theme.primary}
          onPress={onPress}
        />
      ),
      Network: (
        <Resource
          name="Network"
          description={`${prettyBytes(usedNet)} / ${prettyBytes(maxNet)}`}
          percent={percentNet}
          color={Theme.tertiary}
          onPress={onPress}
        />
      ),
      RAM: (
        <Resource
          name="RAM"
          description={`${prettyBytes(usedRam)} / ${prettyBytes(usedRam)}`}
          percent={percentRam}
          color={Theme.secondary}
        />
      )
    };

    if (!fetched) {
      return <ResourceIndicator />;
    }

    return resourceTypes[type];
  }
}
