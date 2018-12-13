import React from 'react';
import { View, PanResponder } from 'react-native';
import { Theme } from '../../constants';

const min = 0;
const max = 1;
const CIRCLE_DIAMETER = 25;

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
      trackColor = '#ebebeb',
      slidedTrackColor = Theme.palette.primary,
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
          paddingHorizontal: CIRCLE_DIAMETER / 2
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            height: CIRCLE_DIAMETER,
            backgroundColor: trackColor,
            borderRadius: Theme.innerBorderRadius,
            overflow: 'hidden'
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
            ...Theme.shadow
          }}
          {...this.panResponder.panHandlers}
        />
      </View>
    );
  }
}
