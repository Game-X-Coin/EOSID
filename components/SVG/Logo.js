import React, { Component } from 'react';
import { Svg } from 'expo';

export default class Logo extends Component {
  render() {
    const { width = 1, height = 1 } = this.props;
    return (
      <Svg height={27 * height} width={36 * width} viewBox="0 0 36 27">
        <Svg.Polygon fill="#FFD111" points="0 18 9 27 18 18" />
        <Svg.Polygon
          fill="#0070BE"
          points="18.0000212 0 9 8.99997879 18.0000212 18 27 8.99997879"
        />
        <Svg.Polygon
          fill="#33BA20"
          points="18 18.0000212 27 27 36 18.0000212 27 9"
        />
        <Svg.Polygon fill="#FF4B34" points="0 18 18 18 9 9" />
      </Svg>
    );
  }
}