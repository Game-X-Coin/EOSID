import React, { Component } from 'react';
import { View, Keyboard, ScrollView } from 'react-native';
import { Text, TouchableRipple, Portal, Dialog } from 'react-native-paper';
import { Icon } from 'expo';

import { Theme } from '../../constants';

export class SelectField extends Component {
  state = {
    data: [],
    value: '',
    dialogVisible: false
  };

  static getDerivedStateFromProps({ data = [], value = '' }) {
    return {
      data,
      value
    };
  }

  get formattedData() {
    return this.state.data.map(v => ({
      ...v,
      label: v.label ? v.label : v.value
    }));
  }

  get selectedItem() {
    return this.formattedData.find(v => v.value === this.state.value);
  }

  onChange(v) {
    const { onChange = () => null } = this.props;

    this.toggleDialog();
    onChange(v);
  }

  toggleDialog() {
    Keyboard.dismiss();
    this.setState(state => ({ dialogVisible: !state.dialogVisible }));
  }

  render() {
    const { label, error, info, style, containerStyle, ...props } = this.props;
    const { value, dialogVisible } = this.state;

    const HelperText = props => (
      <Text
        style={{
          alignSelf: 'flex-end',
          fontSize: 12,
          lineHeight: 12,
          ...props.style
        }}
      >
        {props.children}
      </Text>
    );

    const ErrorText = () =>
      error ? (
        <HelperText style={{ color: Theme.errorColor }}>{error}</HelperText>
      ) : null;

    const InfoText = () =>
      !error && info ? (
        <HelperText style={{ color: Theme.infoColor }}>{info}</HelperText>
      ) : null;

    const Label = () =>
      label ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 10
          }}
        >
          <Text style={{ flex: 1, fontSize: 14 }}>{label}</Text>
          <InfoText />
          <ErrorText />
        </View>
      ) : null;

    const DataDialog = () => (
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => this.toggleDialog()}
          style={{
            alignSelf: 'center',
            marginHorizontal: 0,
            marginVertical: 100,
            width: 250
          }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingVertical: Theme.innerPadding
            }}
          >
            {this.formattedData.map((v, i) => {
              const actived = value === v.value;

              return (
                <TouchableRipple
                  key={i}
                  onPress={() => this.onChange(v.value)}
                  style={{
                    paddingVertical: 17,
                    backgroundColor: actived ? Theme.primary : '#fff'
                  }}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 17,
                      color: actived ? '#fff' : Theme.primary
                    }}
                  >
                    {v.label}
                  </Text>
                </TouchableRipple>
              );
            })}
          </ScrollView>
        </Dialog>
      </Portal>
    );
    return (
      <View>
        <DataDialog />

        <Label />

        <View
          style={{
            borderRadius: Theme.innerBorderRadius,
            marginBottom: Theme.innerSpacing,
            backgroundColor: '#fff',
            overflow: 'hidden',
            ...Theme.shadow,
            ...containerStyle
          }}
        >
          <TouchableRipple onPress={() => this.toggleDialog()}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 15,
                height: 48,
                ...style
              }}
              {...props}
            >
              <Text style={{ flex: 1, fontSize: 15, paddingRight: 10 }}>
                {this.selectedItem.label}
              </Text>
              <Icon.Ionicons
                name="md-arrow-dropdown"
                color={Theme.infoColor}
                size={25}
              />
            </View>
          </TouchableRipple>
        </View>
      </View>
    );
  }
}
