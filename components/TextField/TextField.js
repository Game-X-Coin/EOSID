import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';

import { Theme } from '../../constants';
import { Indicator } from '../Indicator';

export class TextField extends Component {
  render() {
    const {
      label,
      info,
      error,
      loading,
      containerStyle,
      style,
      suffix,
      prefix,
      prefixComp,
      suffixComp,
      onPress,
      ...props
    } = this.props;

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

    const Prefix = () =>
      prefix ? (
        <Text
          style={{ paddingRight: 15, fontSize: 15, color: Theme.infoColor }}
        >
          {prefix}
        </Text>
      ) : null;

    const Suffix = () =>
      suffix ? (
        <Text
          style={{ paddingRight: 15, fontSize: 15, color: Theme.infoColor }}
        >
          {suffix}
        </Text>
      ) : null;

    const LoadingIndicator = () =>
      loading ? (
        <View style={{ paddingRight: 15 }}>
          <Indicator size="small" />
        </View>
      ) : null;

    return (
      <View style={{ marginTop: 10, ...containerStyle }}>
        <Label />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: Theme.innerSpacing
          }}
        >
          {prefixComp}
          <TouchableRipple
            style={{
              flex: 1,
              borderRadius: Theme.innerBorderRadius,
              backgroundColor: '#fff',
              ...Theme.shadow
            }}
            onPress={onPress}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Prefix />
              <TextInput
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  fontSize: 15,
                  ...style
                }}
                pointerEvents={onPress ? 'none' : 'auto'}
                {...props}
              />
              <Suffix />
              <LoadingIndicator />
            </View>
          </TouchableRipple>
          {suffixComp}
        </View>
      </View>
    );
  }
}
