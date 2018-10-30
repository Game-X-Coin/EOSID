import React, { Component, PureComponent } from 'react';
import { observable, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import { ScrollView, View } from 'react-native';
import {
  Text,
  Button,
  Caption,
  Divider,
  Colors,
  Paragraph
} from 'react-native-paper';

import { Slider } from '../../../components/Slider';
import { DialogIndicator } from '../../../components/Indicator';

class ResourceView extends PureComponent {
  render() {
    const {
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

  @observable
  showDialog = false;

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

    navigation.navigate('ConfirmPin', {
      pinProps: {
        title: 'Confirm Unstake',
        description: `Unstake ${totalAmount} EOS from cpu/net`
      },
      // when PIN matched
      cb: async () => {
        // show loading dialog
        this.showDialog = true;

        // fetch
        const result = await accountStore.manageResource({
          cpu,
          net
        });

        // hide dialog
        this.showDialog = false;

        if (result.code) {
          navigation.navigate('ShowError', {
            title: 'Unstake Resource Failed',
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
      resourceAmount,
      resourceSlide,
      unstakableAmount,
      showDialog
    } = this;

    return (
      <React.Fragment>
        <DialogIndicator
          visible={showDialog}
          title="Preparing to unstake resource..."
        />

        <ScrollView style={{ flex: 1 }}>
          <View style={{ flex: 1, padding: 20 }}>
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
