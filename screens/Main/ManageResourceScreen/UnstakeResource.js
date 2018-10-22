import React, { Component, PureComponent } from 'react';
import { observable, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import { ScrollView, View } from 'react-native';
import {
  Text,
  Button,
  TouchableRipple,
  Caption,
  Divider,
  Colors,
  Paragraph
} from 'react-native-paper';

import { Slider } from '../../../components/Slider';

class ResourceView extends PureComponent {
  render() {
    const {
      style,
      title,
      amount,
      amountPercent,
      slide,
      slideColor,
      onChange
    } = this.props;

    return (
      <View
        style={{
          marginBottom: 5
        }}
      >
        <Caption>{title}</Caption>

        <View
          style={{
            alignItems: 'center',
            padding: 10,
            borderRadius: 3
          }}
        >
          <Text
            style={{
              marginBottom: 5,
              fontSize: 30,
              textAlign: 'center'
            }}
          >
            {amountPercent}%
          </Text>
          <Text
            style={{ fontSize: 13, color: Colors.grey900, textAlign: 'center' }}
          >
            {amount} EOS
          </Text>
        </View>

        <Slider
          value={slide}
          trackColor={slideColor}
          slidedTrackColor={Colors.red700}
          onChange={v => onChange(v)}
        />
      </View>
    );
  }
}

@inject('accountStore')
@observer
export class UnstakeResource extends Component {
  @observable
  resourceSlide = {
    cpu: 0,
    net: 0
  };

  @computed
  get stakedAmount() {
    return {
      cpu: this.props.accountStore.info.cpu_weight * 0.0001,
      net: this.props.accountStore.info.net_weight * 0.0001
    };
  }

  @computed
  get unstakableAmount() {
    // required resource amount for account
    const minAmount = 0.0001;

    return {
      cpu: this.stakedAmount.cpu - minAmount,
      net: this.stakedAmount.net - minAmount
    };
  }

  @computed
  get resourceAmount() {
    return {
      cpu: this.resourceSlide.cpu * this.unstakableAmount.cpu,
      net: this.resourceSlide.net * this.unstakableAmount.net,
      cpuPercent: (this.resourceSlide.cpu * 100).toFixed(1),
      netPercent: (this.resourceSlide.net * 100).toFixed(1)
    };
  }

  changeResourceAmount(v, type) {
    this.resourceSlide[type] = v;
  }

  onSubmit() {
    const { navigation, accountStore } = this.props;
    const { cpu, net } = this.resourceAmount;

    const totalAmount = (cpu + net).toFixed(4);

    const ConfirmTitle = `Confirm unstake ${totalAmount} EOS from cpu/net`;

    navigation.navigate('ConfirmPin', {
      pinProps: {
        titleEnter: ConfirmTitle
      },
      // when PIN matched
      async cb() {
        // show loading spinner

        // fetch
        await accountStore.manageResource({
          cpu,
          net
        });

        // hide loading spinner

        // move
        navigation.navigate('Account');
      }
    });
  }

  moveScreen = routeName => this.props.navigation.navigate(routeName);

  render() {
    const { resourceAmount, resourceSlide, unstakableAmount } = this;

    return (
      <React.Fragment>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            {/* Title */}
            <View style={{ marginVertical: 20 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center'
                }}
              >
                <TouchableRipple
                  borderless
                  style={{ marginRight: 40 }}
                  onPress={() => this.props.changeResourceMode(true)}
                >
                  <Text style={{ color: 'gray' }}>Stake</Text>
                </TouchableRipple>

                <Text
                  style={{
                    paddingBottom: 3,
                    borderBottomColor: Colors.purple500,
                    borderBottomWidth: 3
                  }}
                >
                  Unstake
                </Text>
              </View>
            </View>

            {/* Resource Views */}
            <ResourceView
              title={`CPU - ${unstakableAmount.cpu.toFixed(4)} EOS unstakable`}
              amount={resourceAmount.cpu.toFixed(4)}
              amountPercent={resourceAmount.cpuPercent}
              slide={resourceSlide.cpu}
              slideColor={Colors.blue700}
              onChange={v => this.changeResourceAmount(v, 'cpu')}
            />

            <Divider style={{ marginVertical: 10 }} />

            <ResourceView
              title={`Network - ${unstakableAmount.net.toFixed(
                4
              )} EOS unstakable`}
              amount={resourceAmount.net.toFixed(4)}
              amountPercent={resourceAmount.netPercent}
              slide={resourceSlide.net}
              slideColor={Colors.green700}
              onChange={v => this.changeResourceAmount(v, 'net')}
            />

            <Divider style={{ marginVertical: 10 }} />

            <View>
              <Caption>Note:</Caption>

              <Paragraph>
                - All resources must have a minimum stake amount (0.0001 EOS)
              </Paragraph>
              <Paragraph>
                - All the refunding EOS will be returned 3 days after the last
                unstake
              </Paragraph>
            </View>
          </View>
        </ScrollView>

        <View style={{ margin: 15 }}>
          <Button
            style={{ padding: 5 }}
            mode="contained"
            disabled={resourceAmount.cpu <= 0 && resourceAmount.net <= 0}
            onPress={() => this.onSubmit()}
          >
            Continue
          </Button>
        </View>
      </React.Fragment>
    );
  }
}
