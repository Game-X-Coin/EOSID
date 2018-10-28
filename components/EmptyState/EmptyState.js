import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { Title, Paragraph, Colors } from 'react-native-paper';

export class EmptyState extends Component {
  render() {
    const {
      image,
      title,
      description,
      children,
      imageSize = 200,
      imageStyle,
      titleStyle,
      descriptionStyle
    } = this.props;

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          style={{ width: imageSize, height: imageSize, ...imageStyle }}
          source={image}
        />

        <Title style={{ marginBottom: 5, ...titleStyle }}>{title}</Title>

        <Paragraph
          style={{
            marginBottom: 35,
            paddingHorizontal: 30,
            color: Colors.grey500,
            textAlign: 'center',
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
