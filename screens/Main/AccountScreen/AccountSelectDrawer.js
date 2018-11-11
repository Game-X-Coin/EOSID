import React, { Component } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { View, Platform, Text } from 'react-native';
import { Constants, Icon } from 'expo';
import { withNavigation } from 'react-navigation';
import { Portal, Modal, TouchableRipple } from 'react-native-paper';

import { Theme } from '../../../constants';

import { ScrollView } from '../../../components/View';

@withNavigation
@inject('accountStore')
@observer
export class AccountSelectDrawer extends Component {
  @observable
  visible = false;

  changeAccount(accountId) {
    this.props.onHide();
    this.props.accountStore.changeCurrentAccount(accountId);
  }

  moveScreen() {
    this.props.onHide();
    this.props.navigation.navigate('ImportAccount');
  }

  render() {
    const { visible, onHide = () => null } = this.props;
    const { currentAccount, accounts } = this.props.accountStore;

    const ListItem = ({
      title,
      dark,
      style,
      right,
      onPress = () => null,
      onLongPress = () => null
    }) => (
      <TouchableRipple
        style={{
          paddingHorizontal: 25,
          paddingVertical: 20,
          ...style
        }}
        onPress={onPress}
        onLongPress={onLongPress}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ flex: 1, fontSize: 18, color: dark && '#fff' }}>
            {title}
          </Text>
          {right}
        </View>
      </TouchableRipple>
    );

    return (
      <Portal>
        <Modal visible={visible} onDismiss={() => onHide()}>
          <View
            style={{
              position: 'absolute',
              top: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,
              left: 0,
              right: 0,
              marginVertical: 0,
              backgroundColor: '#fff'
            }}
          >
            <ScrollView>
              {accounts.map(({ id, name }) => (
                <ListItem
                  key={id}
                  title={name}
                  right={
                    name === (currentAccount && currentAccount.name) && (
                      <Icon.Ionicons
                        name="md-checkmark"
                        color={Theme.primary}
                        size={25}
                      />
                    )
                  }
                  onPress={() => this.changeAccount(id)}
                />
              ))}

              <ListItem
                dark
                style={{ backgroundColor: Theme.primary }}
                title="Import Account"
                right={<Icon.Ionicons name="md-add" color="#fff" size={30} />}
                onPress={() => this.moveScreen()}
              />
            </ScrollView>
          </View>
        </Modal>
      </Portal>
    );
  }
}
