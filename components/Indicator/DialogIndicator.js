import React, { Component } from 'react';
import { View } from 'react-native';
import { Portal, Dialog, Paragraph } from 'react-native-paper';

import { Indicator } from './Indicator';

export class DialogIndicator extends Component {
  render() {
    const { visible, title, ...props } = this.props;

    return (
      <Portal>
        <Dialog visible={visible} dismissable={false}>
          <Dialog.Content>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Indicator {...props} />
              <Paragraph style={{ marginLeft: 20 }}>{title}</Paragraph>
            </View>
          </Dialog.Content>
        </Dialog>
      </Portal>
    );
  }
}
