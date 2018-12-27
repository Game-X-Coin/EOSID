import React, { Component } from 'react';
import { Image } from 'react-native';
import { Title, Paragraph } from 'react-native-paper';

import { Theme, DarkTheme } from '../../constants';
import { BackgroundView } from '../View';

export class EmptyState extends Component {
  render() {
    const {
      image,
      title,
      description,
      children,
      imageSize = 250,
      imageStyle,
      titleStyle,
      descriptionStyle,
      dark
    } = this.props;

    return (
      <BackgroundView
        dark={dark}
        style={{
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Image
          style={{ width: imageSize, height: imageSize, ...imageStyle }}
          source={image}
        />

        <Title
          style={{
            marginBottom: 7,
            ...(dark ? DarkTheme.h4 : Theme.h4),
            ...titleStyle
          }}
        >
          {title}
        </Title>

        <Paragraph
          style={{
            marginBottom: 35,
            paddingHorizontal: 30,
            textAlign: 'center',
            fontSize: Theme.text.fontSize,
            color: dark ? Theme.palette.gray : Theme.palette.darkGray,
            ...descriptionStyle
          }}
        >
          {description}
        </Paragraph>

        {children}
      </BackgroundView>
    );
  }
}
