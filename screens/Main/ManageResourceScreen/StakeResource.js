import React, { Component } from 'react';
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

import { DialogIndicator } from '../../../components/Indicator';
import { Slider } from '../../../components/Slider';

class ResourceView extends Component {
  render() {
    const { props } = this;
    return (
      <View
        style={{
          flex: 1,
          ...props.style
        }}
      >
        <View
          style={{
            alignSelf: 'center',
            paddingVertical: 5,
            paddingHorizontal: 8,
            borderRadius: 3,
            backgroundColor: props.colors.outer
          }}
        >
          <Text style={{ fontSize: 13, color: Colors.white }}>
            {props.title}
          </Text>
        </View>

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
            {props.percent}%
          </Text>
          <Text
            style={{ fontSize: 13, color: Colors.grey900, textAlign: 'center' }}
          >
            {props.amount} EOS
          </Text>
        </View>
      </View>
    );
  }
}

@inject('accountStore')
@observer
export class StakeResource extends Component {
  @observable
  stakableSlide = 0.1;

  @observable
  resourceSlide = 0.7;

  @observable
  showDialog = false;

  @computed
  get unstakedAmount() {
    return parseFloat(this.props.accountStore.tokens.EOS);
  }

  @computed
  get stakedAmount() {
    return {
      cpu: this.props.accountStore.info.cpu_weight * 0.0001,
      net: this.props.accountStore.info.net_weight * 0.0001
    };
  }

  @computed
  get stakableAmount() {
    return this.unstakedAmount * this.stakableSlide;
  }

  @computed
  get resourceAmount() {
    const cpu = this.resourceSlide;
    const net = 1 - this.resourceSlide;

    return {
      cpu: cpu * this.stakableAmount,
      net: net * this.stakableAmount,
      cpuPercent: (cpu * 100).toFixed(1),
      netPercent: (net * 100).toFixed(1)
    };
  }

  changeStakable(v) {
    this.stakableSlide = v;
  }

  changeResourceAmount(v) {
    this.resourceSlide = v;
  }

  onSubmit() {
    const { navigation, accountStore } = this.props;
    const { cpu, net } = this.resourceAmount;

    const totalAmount = (cpu + net).toFixed(4);

    navigation.navigate('ConfirmPin', {
      pinProps: {
        title: 'Confirm Stake',
        description: `Stake ${totalAmount} EOS for cpu/net`
      },
      // when PIN matched
      cb: async () => {
        // show loading dialog
        this.showDialog = true;

        // fetch
        const result = await accountStore.manageResource({
          cpu,
          net,
          isStaking: true
        });

        // hide dialog
        this.showDialog = false;

        if (result.code) {
          navigation.navigate('ShowError', {
            title: 'Stake Resource Failed',
            description: 'Please check the error, it may be a network error.',
            error: result
          });
        } else {
          navigation.navigate('Account');
        }
      }
    });
  }

  render() {
    const {
      showDialog,

      resourceAmount,
      resourceSlide,
      stakableSlide,
      stakableAmount,
      unstakedAmount
    } = this;

    const easyControls = {
      '10%': 0.1,
      '25%': 0.25,
      '50%': 0.5,
      '75%': 0.75,
      MAX: 1
    };

    return (
      <React.Fragment>
        <DialogIndicator
          visible={showDialog}
          title="Preparing to stake resource..."
        />

        <ScrollView style={{ flex: 1 }}>
          <View style={{ flex: 1, padding: 20 }}>
            {/* Description */}
            <View>
              <Caption>Stakable Amount</Caption>
              <Text style={{ fontSize: 18 }}>{unstakedAmount} EOS</Text>
            </View>

            <Divider style={{ marginVertical: 10 }} />

            <View>
              <Caption>Amount to stake</Caption>
              <View
                style={{
                  flexDirection: 'row',
                  marginVertical: 5
                }}
              >
                {Object.keys(easyControls).map(key => {
                  const active = easyControls[key] === stakableSlide;

                  return (
                    <TouchableRipple
                      key={key}
                      style={{ marginRight: 7 }}
                      onPress={() => this.changeStakable(easyControls[key])}
                    >
                      <View
                        style={{
                          paddingHorizontal: 15,
                          paddingVertical: 8,
                          borderRadius: 3,
                          borderWidth: 1,
                          borderColor: Colors.grey900,
                          ...(active
                            ? {
                                backgroundColor: Colors.grey900
                              }
                            : {})
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            ...(active
                              ? {
                                  color: '#fff'
                                }
                              : {})
                          }}
                        >
                          {key}
                        </Text>
                      </View>
                    </TouchableRipple>
                  );
                })}
              </View>
            </View>

            <Divider style={{ marginVertical: 10 }} />

            <View>
              <Caption style={{ marginBottom: 20 }}>
                Slide to scale amount
              </Caption>
              {/* Resource Views */}
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 5
                }}
              >
                <ResourceView
                  title="CPU"
                  percent={resourceAmount.cpuPercent}
                  amount={resourceAmount.cpu.toFixed(4)}
                  colors={{ outer: Colors.blue700, inner: Colors.blue400 }}
                />

                <ResourceView
                  title="Network"
                  percent={resourceAmount.netPercent}
                  amount={resourceAmount.net.toFixed(4)}
                  colors={{ outer: Colors.green700, inner: Colors.green400 }}
                />
              </View>
              {/* Slider */}
              <Slider
                value={resourceSlide}
                trackColor={Colors.green700}
                slidedTrackColor={Colors.blue700}
                onChange={v => this.changeResourceAmount(v)}
              />

              <Divider style={{ marginVertical: 10 }} />

              <View>
                <Caption>Note:</Caption>
                <Paragraph>
                  - You can unstake the resources at any time, but there will be
                  a three-day waiting period
                </Paragraph>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Continue */}
        <View style={{ margin: 15 }}>
          <Button
            style={{ padding: 5 }}
            mode="contained"
            disabled={stakableAmount <= 0}
            onPress={() => this.onSubmit()}
          >
            Continue
          </Button>
        </View>
      </React.Fragment>
    );
  }
}
