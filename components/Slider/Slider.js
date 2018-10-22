import React from 'react';
import { View, PanResponder } from 'react-native';

const min = 0;
const max = 1;
const CIRCLE_DIAMETER = 30;

export class Slider extends React.Component {
  state = {
    barWidth: null,
    deltaValue: 0,
    value: 0
  };

  static getDerivedStateFromProps(props, state) {
    return {
      value: props.value - state.deltaValue
    };
  }

  panResponder = PanResponder.create({
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderMove: (_, gestureState) => this.onMove(gestureState),
    onPanResponderRelease: () => this.onEndMove(),
    onPanResponderTerminate: () => {}
  });

  onMove(gestureState) {
    const { barWidth } = this.state;
    const newDeltaValue = this.getValueFromLeftOffset(
      +gestureState.dx,
      barWidth,
      min,
      max
    );

    this.setState({
      deltaValue: newDeltaValue
    });

    const newCappedValue = this.capValueWithinRange(
      this.state.value + newDeltaValue,
      [min, max]
    );

    this.props.onChange(newCappedValue);
  }

  onEndMove() {
    const { value, deltaValue } = this.state;

    this.setState({ value: value + deltaValue, deltaValue: 0 });
  }

  onBarLayout = event => {
    const { width: barWidth } = event.nativeEvent.layout;
    this.setState({ barWidth });
  };

  capValueWithinRange = (value, range) => {
    if (value < range[0]) {
      return range[0];
    }
    if (value > range[1]) {
      return range[1];
    }
    return value;
  };

  getValueFromLeftOffset = (offset, barWidth = null, rangeMin, rangeMax) => {
    if (barWidth === null) {
      return 0;
    }
    return ((rangeMax - rangeMin) * offset) / barWidth;
  };

  getLeftOffsetFromValue = (value, rangeMin, rangeMax, barWidth = null) => {
    if (barWidth === null) {
      return 0;
    }
    const valueOffset = value - rangeMin;
    const totalRange = rangeMax - rangeMin;
    const percentage = valueOffset / totalRange;
    return barWidth * percentage;
  };

  render() {
    const { value, deltaValue, barWidth } = this.state;
    const {
      trackColor = '#b7b7b7',
      slidedTrackColor = '#1073ff',
      thumbColor = '#fff'
    } = this.props;

    const cappedValue = this.capValueWithinRange(value + deltaValue, [
      min,
      max
    ]);

    const leftOffset = this.getLeftOffsetFromValue(
      cappedValue,
      min,
      max,
      barWidth
    );

    return (
      <View
        style={{
          justifyContent: 'center',
          padding: CIRCLE_DIAMETER / 2
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            height: 4,
            backgroundColor: trackColor,
            borderRadius: 3
          }}
          onLayout={this.onBarLayout}
        >
          <View
            style={{
              width: leftOffset,
              backgroundColor: slidedTrackColor
            }}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            left: leftOffset,
            backgroundColor: thumbColor,
            borderRadius: CIRCLE_DIAMETER / 2,
            width: CIRCLE_DIAMETER,
            height: CIRCLE_DIAMETER,
            // shadows in Android
            elevation: 4,
            // shadows in IOS
            shadowColor: 'black',
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 2,
            shadowOpacity: 0.5
          }}
          {...this.panResponder.panHandlers}
        />
      </View>
    );
  }
}
