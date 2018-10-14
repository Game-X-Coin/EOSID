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
  RadioButton
} from 'react-native-paper';
import { LinearGradient, Icon } from 'expo';
import bytes from 'bytes';
import prettyMs from 'pretty-ms';

import HomeStyle from '../../../styles/HomeStyle';

@inject('accountStore')
@observer
export class AccountScreen extends Component {
  @observable
  account = {};

  @observable
  balances = [];

  @observable
  fetched = false;

  @observable
  selectAccount = false;

  componentDidMount() {
    this.props.accountStore.getAccountInfo();
  }

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
      <View>
        <Title style={{ marginVertical: 10 }}>
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
        ram_quota
      } = info;

      const delegatedCPU = cpu_weight * 0.0001;
      const delegatedNET = net_weight * 0.0001;
      const undelegatedAmount = parseFloat(
        tokens.find(token => token.symbol === 'EOS').amount
      );
      const totalAsset = delegatedCPU + delegatedNET + undelegatedAmount;

      const DelegatedItem = ({
        title,
        subTitle,
        amount,
        percentage,
        color
      }) => (
        <View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>{title}</Text>
              {` (${subTitle})`}
            </Text>

            <Text>{amount && `${amount.toFixed(4)} EOS`}</Text>
          </View>
          <ProgressBar progress={percentage} color={color} />
        </View>
      );

      return (
        <View>
          <LinearGradient
            colors={[Colors.grey700, Colors.grey900]}
            start={[1, 0]}
            end={[0, 1]}
            style={{
              marginTop: 20,
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

          <View style={{ marginTop: 25, paddingHorizontal: 5 }}>
            <DelegatedItem
              title="CPU"
              subTitle={`${this.prettyTime(cpu_limit.used)}/${this.prettyTime(
                cpu_limit.max
              )}`}
              amount={delegatedCPU}
              percentage={cpu_limit.used / cpu_limit.max}
              color={Colors.red800}
            />

            <DelegatedItem
              title="Network"
              subTitle={`${this.prettyTime(net_limit.used)}/${this.prettyTime(
                net_limit.max
              )}`}
              amount={delegatedNET}
              percentage={cpu_limit.used / cpu_limit.max}
              color={Colors.cyan800}
            />

            <DelegatedItem
              title="RAM"
              subTitle={`${this.prettyBytes(ram_usage)}/${this.prettyBytes(
                ram_quota
              )}`}
              percentage={ram_usage / ram_quota}
              color={Colors.purple800}
            />
          </View>

          <Divider style={{ marginVertical: 15 }} />

          <View>
            <Text
              style={{
                marginHorizontal: 10,
                marginBottom: 15,
                fontSize: 17,
                fontWeight: 'bold'
              }}
            >
              Tokens
            </Text>
            {tokens.map(({ symbol, amount }, i) => (
              <TouchableRipple
                key={i}
                onPress={() => this.moveScreen('Transfer', { symbol })}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    paddingHorizontal: 15
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
        <SafeAreaView>
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

          <ScrollView style={{ paddingHorizontal: 15 }}>
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
