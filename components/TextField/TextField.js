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
          fontSize: 13,
          lineHeight: 13,
          ...props.style
        }}
      >
        {props.children}
      </Text>
    );

    const ErrorText = () => (
      <View
        style={{
          height: 25,
          paddingHorizontal: 15,
          justifyContent: 'center'
        }}
      >
        <HelperText
          style={{
            width: '100%',
            color: Theme.palette.error
          }}
        >
          {error}
        </HelperText>
      </View>
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

    const Prefix = () =>
      prefix ? (
        <Text
          style={{
            paddingRight: 15,
            fontSize: 15,
            color: Theme.palette.darkGray
          }}
        >
          {prefix}
        </Text>
      ) : null;

    const Suffix = () =>
      suffix ? (
        <Text
          style={{
            paddingRight: 15,
            fontSize: 15,
            color: Theme.palette.darkGray
          }}
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
      <View style={{ marginVertical: 10 }}>
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
            onPress={onPress}
          >
            <View>
              <Label />

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start'
                }}
              >
                {prefixComp}
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
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <Prefix />
                    <TextInput
                      style={{
                        flex: 1,
                        paddingHorizontal: 15,
                        paddingVertical: 10,
                        fontSize: 17,
                        ...style
                      }}
                      pointerEvents={onPress ? 'none' : 'auto'}
                      {...props}
                    />
                    <Suffix />
                    <LoadingIndicator />
                  </View>
                </View>
                {suffixComp}
              </View>
            </View>
          </TouchableRipple>
        </View>

        <ErrorText />
      </View>
    );
  }
}
