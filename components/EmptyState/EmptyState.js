import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { Title, Paragraph } from 'react-native-paper';

import { Theme } from '../../constants';

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
      descriptionStyle
    } = this.props;

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Theme.app.backgroundColor
        }}
      >
        <Image
          style={{ width: imageSize, height: imageSize, ...imageStyle }}
          source={image}
        />

        <Title style={{ marginBottom: 7, fontSize: 22, ...titleStyle }}>
          {title}
        </Title>

        <Paragraph
          style={{
            marginBottom: 35,
            paddingHorizontal: 30,
            textAlign: 'center',
            color: Theme.pallete.darkGray,
            ...descriptionStyle
          }}
        >
          {description}
        </Paragraph>

        {children}
      </View>
    );
  }
}
