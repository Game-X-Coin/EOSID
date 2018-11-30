import React, { Component, PureComponent } from 'react';
import { observer, inject } from 'mobx-react';
import { View, Image } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { Svg } from 'expo';
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
  render() {
    const {
      name,
      icon,
      weight,
      value,
      percent,
      gradient,
      onPress
    } = this.props;

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
                flex: 1,
                flexDirection: 'row',
                marginTop: 5
              }}
            >
              <Image
                style={{ width: 20, height: 20, marginRight: 10 }}
                source={icon}
              />
              <Text>{name}</Text>
            </View>

            <Text style={{ marginBottom: 5, ...Theme.h4 }}>{value}</Text>
            {weight && (
              <Text style={{ ...Theme.p, color: Theme.palette.darkGray }}>
                {weight.toFixed(4)} EOS
              </Text>
            )}
          </View>

          <Svg width="100" height="100" viewBox="0 0 36 36">
            <Svg.Defs>
              <Svg.LinearGradient
                id="gradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <Svg.Stop offset="0%" stopColor={gradient[0]} />
                <Svg.Stop offset="100%" stopColor={gradient[1]} />
              </Svg.LinearGradient>
            </Svg.Defs>

            <Svg.Path
              fill="none"
              stroke={Theme.palette.gray}
              strokeWidth="3"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <Svg.Path
              stroke="url(#gradient)"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${percent}, 100`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <Svg.Text
              x="19"
              y="19"
              fill="#666"
              fontSize="7"
              alignmentBaseline="middle"
              textAnchor="middle"
            >
              {`${percent.toFixed(0)}%`}
            </Svg.Text>
          </Svg>
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
      ram_usage: usedRam = 0,
      total_resources: { cpu_weight = 0, net_weight = 0 } = {}
    } = info;

    const percentCpu = ((maxCpu - usedCpu) / maxCpu) * 100;
    const percentNet = ((maxNet - usedNet) / maxNet) * 100;
    const percentRam = ((maxRam - usedRam) / maxRam) * 100;
    const weightCpu = parseFloat(cpu_weight);
    const weightNet = parseFloat(net_weight);

    const resourceTypes = {
      CPU: (
        <Resource
          name="CPU"
          icon={require('../../../assets/icons/cpu.png')}
          value={`${prettySec(usedCpu)} / ${prettySec(maxCpu)}`}
          percent={percentCpu}
          weight={weightCpu}
          gradient={[Theme.palette.secondary, '#ffa2a6']}
          onPress={onPress}
        />
      ),
      Network: (
        <Resource
          name="Network"
          icon={require('../../../assets/icons/network.png')}
          value={`${prettyBytes(usedNet)} / ${prettyBytes(maxNet)}`}
          percent={percentNet}
          weight={weightNet}
          gradient={[Theme.palette.tertiary, '#93efdd']}
          onPress={onPress}
        />
      ),
      RAM: (
        <Resource
          name="RAM"
          icon={require('../../../assets/icons/ram.png')}
          value={`${prettyBytes(usedRam)} / ${prettyBytes(maxRam)}`}
          percent={percentRam}
          gradient={[Theme.palette.quaternary, '#fbd035']}
        />
      )
    };

    return resourceTypes[type];
  }
}
