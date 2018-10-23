import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { View } from 'react-native';
import { Text, TouchableRipple, Colors } from 'react-native-paper';
import { Icon } from 'expo';

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
    const { description, backgroundColor = '#6200ee' } = this.props;

    const isFailing = this.state.status === 'failure';

    const backgroundStyle = {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      zIndex: -1,
      backgroundColor
    };

    const Key = props => (
      <TouchableRipple style={{ flex: 1 }} onPress={props.onPress}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: 60
          }}
        >
          {props.children}
        </View>
      </TouchableRipple>
    );

    const NumKeys = () =>
      numKeys.map(key => (
        <Key onPress={() => this.changePincode(key)}>
          <Text style={{ lineHeight: 25, fontSize: 25, color: Colors.grey900 }}>
            {key}
          </Text>
        </Key>
      ));

    const KeyPadRow = props => (
      <View style={{ flexDirection: 'row' }}>{props.children}</View>
    );

    const KeyPad = () => (
      <View
        style={{
          backgroundColor: '#fff',
          paddingVertical: 10,
          paddingHorizontal: 15
        }}
      >
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
          <Key />
          {NumKeys()[9]}
          <Key onPress={() => this.removePincode()}>
            <Icon.Ionicons size={30} name="md-backspace" />
          </Key>
        </KeyPadRow>
      </View>
    );

    return (
      <View style={backgroundStyle}>
        <View style={{ flex: 1 }}>
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text
              style={{
                paddingHorizontal: 30,
                marginBottom: 30,
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
                    width: 17,
                    height: 17,
                    borderRadius: 17 / 2,
                    backgroundColor: '#fff',
                    opacity: k < pincode.length ? 1 : 0.3
                  }}
                />
              ))}
            </View>
          </View>
          <KeyPad />
        </View>
      </View>
    );
  }
}
