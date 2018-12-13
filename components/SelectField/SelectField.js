import React, { Component } from 'react';
import { View, Keyboard, ScrollView, Platform } from 'react-native';
import { Text, TouchableRipple, Portal, Dialog } from 'react-native-paper';
import { Icon } from 'expo';
import { AndroidBackHandler } from 'react-navigation-backhandler';

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

    this.hideDialog();
    onChange(v);
  }

  showDialog() {
    Keyboard.dismiss();
    this.setState({ dialogVisible: true });
  }

  hideDialog() {
    Keyboard.dismiss();
    this.setState({ dialogVisible: false });
  }

  onBackPress() {
    if (this.state.dialogVisible) {
      this.hideDialog();
      return true;
    }

    return false;
  }

  render() {
    const { label, error, info, style, containerStyle, ...props } = this.props;
    const { value, dialogVisible } = this.state;

    const HelperText = props => (
      <Text
        style={{
          alignSelf: 'flex-end',
          fontSize: 13,
          lineHeight: 13,
          ...props.style
        }}
      >
        {props.children}
      </Text>
    );

    const InfoText = () =>
      info ? (
        <HelperText style={{ color: Theme.palette.darkGray }}>
          {info}
        </HelperText>
      ) : null;

    const Label = () =>
      label ? (
        <View
          style={{
            paddingHorizontal: 15,
            paddingTop: 15,
            flexDirection: 'row',
            alignItems: 'flex-start'
          }}
        >
          <HelperText style={{ flex: 1 }}>{label}</HelperText>
          <InfoText />
        </View>
      ) : null;

    const DataDialog = () => (
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => this.hideDialog()}
          style={{
            alignSelf: 'center',
            marginHorizontal: 0,
            marginVertical: 100,
            width: 300,
            overflow: 'hidden'
          }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1
            }}
          >
            {label && (
              <View
                style={{
                  padding: 15,
                  borderBottomColor: Theme.palette.primary,
                  borderBottomWidth: 2
                }}
              >
                <Text style={Theme.h5}>{label}</Text>
              </View>
            )}

            {this.formattedData.map((v, i) => {
              const actived = value === v.value;

              return (
                <TouchableRipple
                  key={i}
                  onPress={() => this.onChange(v.value)}
                  style={{
                    paddingHorizontal: 25,
                    paddingVertical: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: Theme.palette.gray
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row'
                    }}
                  >
                    <Text
                      style={{
                        flex: 1,
                        ...Theme.h5
                      }}
                    >
                      {v.label}
                    </Text>

                    {actived && (
                      <Icon.Ionicons
                        name="md-checkmark"
                        color={Theme.palette.primary}
                        size={25}
                      />
                    )}
                  </View>
                </TouchableRipple>
              );
            })}
          </ScrollView>
        </Dialog>
      </Portal>
    );
    return (
      <AndroidBackHandler onBackPress={() => this.onBackPress()}>
        <View style={{ marginVertical: 10, ...containerStyle }}>
          <DataDialog />
          <View
            style={{
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              overflow: 'hidden'
            }}
          >
            <TouchableRipple
              style={{
                backgroundColor: Theme.palette.gray
              }}
              onPress={() => this.showDialog()}
            >
              <View>
                <Label />

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start'
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      borderBottomWidth: 2,
                      borderBottomColor: error
                        ? Theme.palette.error
                        : Theme.palette.primary
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 15,
                        height: Platform.OS === 'ios' ? 40.3 : 48,
                        ...style
                      }}
                      {...props}
                    >
                      <Text style={{ flex: 1, fontSize: 15, paddingRight: 10 }}>
                        {this.selectedItem && this.selectedItem.label}
                      </Text>
                      <Icon.Ionicons
                        name="md-arrow-dropdown"
                        color={Theme.palette.darkGray}
                        size={25}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </TouchableRipple>
          </View>
        </View>
      </AndroidBackHandler>
    );
  }
}
