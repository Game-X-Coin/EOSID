import React, { Component } from 'react';
import { View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';

import { TextField } from '../../../components/TextField';
import { Theme } from '../../../constants';

export class ResourceTextField extends Component {
  render() {
    const { onChangePercent = () => null, ...props } = this.props;

    const easyControls = {
      10: 0.1,
      25: 0.25,
      50: 0.5,
      75: 0.75,
      100: 1
    };

    return (
      <View>
        <TextField
          keyboardType="numeric"
          textAlign="right"
          suffix="EOS"
          style={{ marginBottom: 0, fontSize: 17 }}
          {...props}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 30
          }}
        >
          {Object.keys(easyControls).map(key => {
            return (
              <View
                key={key}
                style={{
                  flex: 1,
                  marginRight: 10,
                  borderRadius: 4,
                  overflow: 'hidden',
                  ...Theme.shadow
                }}
              >
                <TouchableRipple
                  style={{
                    paddingVertical: 5,
                    backgroundColor: Theme.mainBackgroundColor
                  }}
                  onPress={() => onChangePercent(easyControls[key])}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 12
                    }}
                  >
                    {key}
                  </Text>
                </TouchableRipple>
              </View>
            );
          })}

          <Text style={{ fontSize: 13, color: Theme.infoColor }}>%</Text>
        </View>
      </View>
    );
  }
}
