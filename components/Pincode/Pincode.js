import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { View, Dimensions } from 'react-native';
import { Text, TouchableRipple, Colors } from 'react-native-paper';
import { Icon } from 'expo';

import { DarkTheme } from '../../constants';
import { BackgroundView } from '../View';

const shuffle = array => {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
};

@observer
export class Pincode extends Component {
  availableLength = 6;

  state = {
    status: 'initial'
  };

  @observable
  numKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  @observable
  pincode = [];

  static getDerivedStateFromProps(props, state) {
    if (props.status) {
      return {
        status: props.status
      };
    }

    return null;
  }

  // shuffle keys
  componentDidMount() {
    this.numKeys = [...shuffle(this.numKeys)];
  }

  changePincode(v) {
    const {
      disabled,
      onEnter = () => null,
      onChange = () => null
    } = this.props;

    // when disabled
    if (disabled) {
      return;
    }

    // reset pincode
    if (this.pincode.length === this.availableLength) {
      this.pincode = [];
    }

    // fill pincode
    if (this.pincode.length < this.availableLength) {
      this.pincode = [...this.pincode, v];
      // call onChange
      onChange(this.pincode.join(''));

      // call onEnter
      if (this.pincode.length === this.availableLength) {
        onEnter(this.pincode.join(''));
      }
    }
  }

  removePincode() {
    const { onChange = () => null } = this.props;

    this.pincode = this.pincode.filter((v, i) => i !== this.pincode.length - 1);
    // call onChange
    onChange(this.pincode.join(''));
  }

  render() {
    const { numKeys, pincode, availableLength } = this;
    const { description } = this.props;

    const isFailing = this.state.status === 'failure';

    const KEY_SIZE = Dimensions.get('window').height / 9.5;
    const KEY_FONT_SIZE = KEY_SIZE * 0.35;

    const Key = ({ invisible, onPress, children }) => (
      <View
        style={{
          margin: 10,
          borderRadius: KEY_SIZE,
          overflow: 'hidden'
        }}
      >
        <TouchableRipple
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: invisible
              ? 'transparent'
              : DarkTheme.surface.backgroundColor,
            width: KEY_SIZE,
            height: KEY_SIZE
          }}
          onPress={onPress}
        >
          <View>{children}</View>
        </TouchableRipple>
      </View>
    );

    const KeyPadRow = props => (
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        {props.children}
      </View>
    );

    const NumKeys = () =>
      numKeys.map(key => (
        <Key onPress={() => this.changePincode(key)}>
          <Text
            style={{
              fontSize: KEY_FONT_SIZE,
              color: DarkTheme.text.color
            }}
          >
            {key}
          </Text>
        </Key>
      ));

    const KeyPad = () => (
      <View>
        <KeyPadRow>
          {NumKeys()[0]}
          {NumKeys()[1]}
          {NumKeys()[2]}
        </KeyPadRow>
        <KeyPadRow>
          {NumKeys()[3]}
          {NumKeys()[4]}
          {NumKeys()[5]}
        </KeyPadRow>
        <KeyPadRow>
          {NumKeys()[6]}
          {NumKeys()[7]}
          {NumKeys()[8]}
        </KeyPadRow>
        <KeyPadRow>
          <Key invisible />
          {NumKeys()[9]}
          <Key invisible onPress={() => this.removePincode()}>
            <Icon.Ionicons
              color={DarkTheme.text.color}
              name="md-backspace"
              size={35}
            />
          </Key>
        </KeyPadRow>
      </View>
    );

    return (
      <BackgroundView dark>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 70
          }}
        >
          <Text
            style={{
              paddingHorizontal: 30,
              marginBottom: 40,
              fontSize: 18,
              textAlign: 'center',
              color: isFailing ? Colors.yellow500 : '#fff'
            }}
          >
            {isFailing ? 'Passwords do not match' : description}
          </Text>

          <View style={{ flexDirection: 'row' }}>
            {Array.from({ length: availableLength }, (v, k) => (
              <View
                key={k}
                style={{
                  marginLeft: k === 0 ? 0 : 25,
                  width: 12,
                  height: 12,
                  borderRadius: 12,
                  backgroundColor: '#fff',
                  opacity: k < pincode.length ? 1 : 0.3
                }}
              />
            ))}
          </View>
        </View>

        <KeyPad />
      </BackgroundView>
    );
  }
}
