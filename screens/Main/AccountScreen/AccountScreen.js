import React, { Component } from 'react';
import { observable, reaction } from 'mobx';
import { observer, inject } from 'mobx-react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import {
  Appbar,
  Colors,
  ProgressBar,
  Title,
  Text,
  Card,
  Divider,
  TouchableRipple,
  Portal,
  Modal,
  List,
  RadioButton,
  Caption,
  Button
} from 'react-native-paper';
import { LinearGradient, Icon } from 'expo';
import bytes from 'bytes';
import prettyMs from 'pretty-ms';

import HomeStyle from '../../../styles/HomeStyle';

@inject('accountStore')
@observer
export class AccountScreen extends Component {
  @observable
  selectAccount = false;

  prettyBytes(value) {
    return bytes(value, { thousandsSeparator: ',' });
  }

  prettyTime(value) {
    return prettyMs(value * 0.001);
  }

  moveScreen = (...args) => this.props.navigation.navigate(...args);

  showSelectAccount = () => (this.selectAccount = true);
  hideSelectAccount = () => (this.selectAccount = false);
  changeAccount = accountId => {
    this.selectAccount = false;
    this.props.accountStore.changeUserAccount(accountId);
  };

  render() {
    const {
      userAccounts,
      currentUserAccount,

      info,
      tokens,
      fetched
    } = this.props.accountStore;

    const { selectAccount } = this;

    const NoAccount = () => (
      <View style={{ flex: 1, padding: 15 }}>
        <Title style={{ marginBottom: 5 }}>
          You do not have any accounts added.
        </Title>
        <Card onPress={() => this.moveScreen('AddAccount')}>
          <LinearGradient
            colors={[Colors.purple200, Colors.purple900]}
            start={[1, 0]}
            end={[0, 1]}
            style={{
              padding: 20,
              borderRadius: 5
            }}
          >
            <Title style={{ color: '#fff', fontSize: 25 }}>
              Add eos account
            </Title>

            <Text style={{ color: '#fff', fontSize: 15 }}>
              add eos account by private key
            </Text>
          </LinearGradient>
        </Card>
      </View>
    );

    const HaveAccount = () => {
      const {
        account_name,
        cpu_limit,
        cpu_weight,
        net_limit,
        net_weight,
        ram_usage,
        ram_quota,
        refund_request
      } = info;

      const delegatedCPU = cpu_weight * 0.0001;
      const delegatedNET = net_weight * 0.0001;
      const refundAmount = refund_request
        ? Number(refund_request.cpu_amount.split(' ')[0]) +
          Number(refund_request.net_amount.split(' ')[0])
        : 0;
      const undelegatedAmount = parseFloat(
        tokens.find(token => token.symbol === 'EOS').amount
      );
      const totalAsset = delegatedCPU + delegatedNET + undelegatedAmount;

      const ItemTitle = ({ title }) => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10
          }}
        >
          <Caption>{title}</Caption>

          <Divider style={{ flex: 1, marginLeft: 10 }} />
        </View>
      );

      const DelegatedItem = ({
        title,
        subTitle,
        amount,
        percentage,
        color
      }) => (
        <View>
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'flex-start'
              }}
            >
              <Text style={{ marginRight: 5, fontSize: 15 }}>{title}</Text>
              <Caption>{subTitle}</Caption>
            </View>

            <Text>{amount && `${amount.toFixed(4)} EOS`}</Text>
          </View>
          <ProgressBar
            progress={percentage}
            color={color}
            style={{ paddingVertical: 8 }}
          />
        </View>
      );

      return (
        <View style={{ flex: 1, padding: 20 }}>
          <LinearGradient
            colors={[Colors.grey700, Colors.grey900]}
            start={[1, 0]}
            end={[0, 1]}
            style={{
              marginBottom: 15,
              padding: 20,
              borderRadius: 5
            }}
          >
            <Text style={{ color: '#fff', fontSize: 17, paddingBottom: 15 }}>
              {account_name}
            </Text>
            <Title style={{ color: '#fff', fontSize: 25 }}>
              {totalAsset.toFixed(4)} EOS
            </Title>
          </LinearGradient>

          <View style={{ paddingBottom: 15 }}>
            <ItemTitle title="Resources" />

            <DelegatedItem
              title="CPU"
              subTitle={`(${this.prettyTime(
                cpu_limit.used
              )} / ${this.prettyTime(cpu_limit.max)})`}
              amount={delegatedCPU}
              percentage={cpu_limit.used / cpu_limit.max}
              color={Colors.blue700}
            />

            <DelegatedItem
              title="Network"
              subTitle={`(${this.prettyBytes(
                net_limit.used
              )} / ${this.prettyBytes(net_limit.max)})`}
              amount={delegatedNET}
              percentage={cpu_limit.used / cpu_limit.max}
              color={Colors.green700}
            />

            {refund_request && (
              <DelegatedItem
                title="Refunding"
                subTitle={refund_request.request_time}
                amount={refundAmount}
                percentage={refundAmount / (delegatedCPU + delegatedNET)}
                color={Colors.orange700}
              />
            )}

            <DelegatedItem
              title="RAM"
              subTitle={`(${this.prettyBytes(ram_usage)} / ${this.prettyBytes(
                ram_quota
              )})`}
              percentage={ram_usage / ram_quota}
              color={Colors.purple800}
            />

            <Button
              style={{ marginTop: 5 }}
              onPress={() => this.moveScreen('ManageResource')}
            >
              Manage Resource
            </Button>
          </View>

          <View>
            <ItemTitle title="Tokens" />

            {tokens.map(({ symbol, amount }, i) => (
              <TouchableRipple
                key={i}
                onPress={() => this.moveScreen('Transfer', { symbol })}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: -5,
                    paddingHorizontal: 5,
                    paddingVertical: 10
                  }}
                >
                  <Text style={{ flex: 1, fontSize: 17 }}>{symbol}</Text>
                  <Text style={{ fontSize: 17 }}>{amount}</Text>
                </View>
              </TouchableRipple>
            ))}
          </View>
        </View>
      );
    };

    const SelectAccountDrawer = () => (
      <Portal>
        <Modal
          visible={selectAccount}
          onDismiss={() => this.hideSelectAccount()}
        >
          <List.Section
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              marginVertical: 0,
              backgroundColor: '#fff'
            }}
            title="Change account"
          >
            {userAccounts.map(({ id, name }) => (
              <List.Item
                key={id}
                title={name}
                right={() => (
                  <RadioButton
                    status={
                      name === (currentUserAccount && currentUserAccount.name)
                        ? 'checked'
                        : 'unchecked'
                    }
                    onPress={() => this.changeAccount(id)}
                  />
                )}
                onPress={() => this.changeAccount(id)}
              />
            ))}

            <Divider />

            <List.Item
              title="Add account"
              onPress={() => {
                this.hideSelectAccount();
                this.moveScreen('AddAccount');
              }}
            />
          </List.Section>
        </Modal>
      </Portal>
    );

    return (
      <View style={HomeStyle.container}>
        <SafeAreaView style={HomeStyle.container}>
          <Appbar.Header>
            <View
              style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 15 }}
            >
              <TouchableRipple
                borderless
                onPress={() => this.showSelectAccount()}
              >
                <Title
                  style={{
                    color: '#fff',
                    fontSize: 20
                  }}
                >
                  {currentUserAccount ? currentUserAccount.name : 'Account'}{' '}
                  <Icon.Ionicons name="md-arrow-dropdown" size={18} />
                </Title>
              </TouchableRipple>
              <View style={{ flex: 1 }} />
            </View>
            <Appbar.Action
              icon="add"
              onPress={() => this.moveScreen('AddAccount')}
            />
          </Appbar.Header>

          <ScrollView style={HomeStyle.container}>
            {currentUserAccount ? (
              fetched ? (
                <HaveAccount />
              ) : null
            ) : (
              <NoAccount />
            )}
          </ScrollView>

          <SelectAccountDrawer />
        </SafeAreaView>
      </View>
    );
  }
}
