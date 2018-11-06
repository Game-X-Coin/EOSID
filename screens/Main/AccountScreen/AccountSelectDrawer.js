import React, { Component } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import { Portal, Modal, List, RadioButton, Divider } from 'react-native-paper';

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

    return (
      <Portal>
        <Modal visible={visible} onDismiss={() => onHide()}>
          <List.Section
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              marginVertical: 0,
              backgroundColor: '#fff'
            }}
            title="Select to change account"
          >
            {accounts.map(({ id, name }) => (
              <List.Item
                key={id}
                title={name}
                right={() => (
                  <RadioButton
                    status={
                      name === (currentAccount && currentAccount.name)
                        ? 'checked'
                        : 'unchecked'
                    }
                  />
                )}
                onPress={() => this.changeAccount(id)}
              />
            ))}

            <Divider />

            <List.Item
              title="Import Account"
              onPress={() => this.moveScreen()}
            />
          </List.Section>
        </Modal>
      </Portal>
    );
  }
}
