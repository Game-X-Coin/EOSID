import React, { Component, PureComponent } from 'react';
import { observer, inject } from 'mobx-react';
import { View, Animated, Image } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import bytes from 'bytes';

import { Theme } from '../../../constants';

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
    const { name, icon, description, percent, color, onPress } = this.props;
    const { frame } = this.state;

    return (
      <TouchableRipple
        style={{
          paddingVertical: 15,
          paddingHorizontal: 20
        }}
        onPress={onPress}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 25
              }}
            >
              <Image
                style={{ width: 20, height: 20, marginRight: 10 }}
                source={icon}
              />
              <Text>{name}</Text>
            </View>

            <Text style={{ marginBottom: 3, ...Theme.h4 }}>{description}</Text>
            <Text style={{ ...Theme.p, opacity: 0.5 }}>{percent}% left</Text>
          </View>

          <View
            style={{
              position: 'relative',
              width: 100,
              height: 100,
              borderRadius: 99999,
              borderWidth: 1,
              borderColor: Theme.pallete.gray,
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
    );
  }
}

@inject('accountStore')
@observer
export class ResourceView extends Component {
  render() {
    const {
      accountStore: { info },
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
          icon={require('../../../assets/icons/cpu.png')}
          description={`${prettySec(usedCpu)} / ${prettySec(maxCpu)}`}
          percent={percentCpu}
          color={Theme.pallete.secondary}
          onPress={onPress}
        />
      ),
      Network: (
        <Resource
          name="Network"
          icon={require('../../../assets/icons/network.png')}
          description={`${prettyBytes(usedNet)} / ${prettyBytes(maxNet)}`}
          percent={percentNet}
          color={Theme.pallete.tertiary}
          onPress={onPress}
        />
      ),
      RAM: (
        <Resource
          name="RAM"
          icon={require('../../../assets/icons/ram.png')}
          description={`${prettyBytes(usedRam)} / ${prettyBytes(usedRam)}`}
          percent={percentRam}
          color={Theme.pallete.quaternary}
        />
      )
    };

    return resourceTypes[type];
  }
}
