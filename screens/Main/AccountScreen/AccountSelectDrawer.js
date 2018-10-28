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
    this.props.accountStore.changeUserAccount(accountId);
  }

  moveScreen() {
    this.props.onHide();
    this.props.navigation.navigate('ImportAccount');
  }

  render() {
    const { visible, onHide = () => null } = this.props;
    const { currentUserAccount, userAccounts } = this.props.accountStore;

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
