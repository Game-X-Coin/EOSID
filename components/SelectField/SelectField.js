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
        <HelperText style={{ color: Theme.pallete.darkGray }}>
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
          onDismiss={() => this.toggleDialog()}
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
                  borderBottomColor: Theme.pallete.primary,
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
                    borderBottomColor: Theme.pallete.gray
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
                        color={Theme.pallete.primary}
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
              backgroundColor: Theme.pallete.gray
            }}
            onPress={() => this.toggleDialog()}
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
                      ? Theme.pallete.error
                      : Theme.pallete.primary
                  }}
                >
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
                      {this.selectedItem && this.selectedItem.label}
                    </Text>
                    <Icon.Ionicons
                      name="md-arrow-dropdown"
                      color={Theme.pallete.darkGray}
                      size={25}
                    />
                  </View>
                </View>
              </View>
            </View>
          </TouchableRipple>
        </View>
      </View>
    );
  }
}
